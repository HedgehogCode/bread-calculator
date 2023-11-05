import { describe, expect, test } from "vitest";

import compute from "../compute";
import type { Bread, Recipe } from "../types";

const glutenWeight = (recipe: Recipe) => (recipe.gluten ? recipe.gluten : 0);
const starterFlour = (recipe: Recipe, starterHydration: number) =>
  (100 * recipe.starter.amount) / (100 + starterHydration);
const starterWater = (recipe: Recipe, starterHydration: number) =>
  recipe.starter.amount - starterFlour(recipe, starterHydration);
const totalFlourWeight = (recipe: Recipe, starterHydration: number) =>
  recipe.flour.map((f) => f.amount).reduce((a, b) => a + b, 0) +
  starterFlour(recipe, starterHydration) +
  glutenWeight(recipe);

const createBasicBread = () =>
  ({
    name: "test",

    // Basics
    totalWeight: 100,
    hydration: 50,
    starterPerc: 10,
    saltPerc: 2,

    starter: {
      name: "starter-name",
      hydration: 32,
      protein: 10,
    },

    // Protein target
    useProteinTarget: false,
    proteinTarget: {
      gluten: 80,
      target: 10,
    },

    // Flour
    mainFlour: {
      name: "main-flour",
      protein: 10,
    },
    flours: [],
  }) as Bread;

const addFlours = (bread: Bread) => {
  bread.flours = [
    {
      name: "flour-0",
      protein: 10,
      amount: 20,
    },
    {
      name: "flour-1",
      protein: 10,
      amount: 30,
    },
  ];
  return bread;
};

const addProteinTarget = (bread: Bread) => {
  bread.useProteinTarget = true;
  bread.proteinTarget = {
    gluten: 80,
    target: 15,
  };
  return bread;
};

describe("total weight", () => {
  const totalWeight = (recipe: Recipe) =>
    recipe.water +
    recipe.salt +
    recipe.starter.amount +
    (recipe.gluten ?? 0) +
    recipe.flour.map((f) => f.amount).reduce((a, b) => a + b, 0);

  test("basic bread should have correct weight", () => {
    const bread = createBasicBread();
    const recipe = compute(bread)._unsafeUnwrap();
    expect(totalWeight(recipe)).toBeCloseTo(bread.totalWeight, 5);
  });

  test("bread with multiple flours should have correct weight", () => {
    const bread = addFlours(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();
    expect(totalWeight(recipe)).toBeCloseTo(bread.totalWeight, 5);
  });

  test("bread with additional gluten should have correct weight", () => {
    const bread = addProteinTarget(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();
    expect(totalWeight(recipe)).toBeCloseTo(bread.totalWeight, 5);
  });
});

describe("hydration", () => {
  const hydration = (recipe: Recipe, starterHydration: number) =>
    (100 * (recipe.water + starterWater(recipe, starterHydration))) /
    totalFlourWeight(recipe, starterHydration);

  test("simple recipe should have correct hydration", () => {
    const bread = createBasicBread();
    const recipe = compute(bread)._unsafeUnwrap();
    expect(hydration(recipe, bread.starter.hydration)).toBeCloseTo(
      bread.hydration,
      5,
    );
  });

  test("bread with multiple flours should have correct hydration", () => {
    const bread = addFlours(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();
    expect(hydration(recipe, bread.starter.hydration)).toBeCloseTo(
      bread.hydration,
      5,
    );
  });

  test("bread with protein target should have correct hydration", () => {
    const bread = addProteinTarget(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();
    expect(hydration(recipe, bread.starter.hydration)).toBeCloseTo(
      bread.hydration,
      5,
    );
  });
});

describe("starter percentage", () => {
  // TODO should the starter percentage be relative to the other flours or include itself?
  const starterPerc = (recipe: Recipe, starterHydration: number) =>
    (100 * recipe.starter.amount) /
    (totalFlourWeight(recipe, starterHydration) -
      starterFlour(recipe, starterHydration));

  test("simple recipe should have correct starter percentage", () => {
    const bread = createBasicBread();
    const recipe = compute(bread)._unsafeUnwrap();
    expect(recipe.starter.name).toEqual(bread.starter.name);
    expect(starterPerc(recipe, bread.starter.hydration)).toBeCloseTo(
      bread.starterPerc,
      5,
    );
  });
});

describe("salt percentage", () => {
  const saltPerc = (recipe: Recipe, starterHydration: number) =>
    (100 * recipe.salt) / totalFlourWeight(recipe, starterHydration);

  test("simple recipe should have correct salt percentage", () => {
    const bread = createBasicBread();
    const recipe = compute(bread)._unsafeUnwrap();
    expect(saltPerc(recipe, bread.starter.hydration)).toBeCloseTo(
      bread.saltPerc,
      5,
    );
  });
});

describe("flour amounts", () => {
  const flourAmout = (recipe: Recipe, starterHydration: number, idx: number) =>
    (100 * recipe.flour[idx].amount) /
    totalFlourWeight(recipe, starterHydration);

  test("recipe should have flours in correct amount", () => {
    const bread = addFlours(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();
    expect(flourAmout(recipe, bread.starter.hydration, 1)).toBeCloseTo(
      bread.flours[0].amount,
      5,
    );
    expect(flourAmout(recipe, bread.starter.hydration, 2)).toBeCloseTo(
      bread.flours[1].amount,
      5,
    );
  });
});

describe("protein target", () => {
  const proteinOfFlour = (bread: Bread, flourName: string) => {
    if (flourName === bread.mainFlour.name) {
      return bread.mainFlour.protein;
    }
    const flour = bread.flours.find((f) => f.name === flourName);
    if (!flour) {
      throw new Error("Flour not found");
    }
    return flour.protein;
  };

  const protein = (bread: Bread, recipe: Recipe) => {
    // NB: just to tell the typescript compiler the gluten is defined
    if (!recipe.gluten) {
      throw new Error("Gluten not defined");
    }
    const glutenProtein = recipe.gluten * bread.proteinTarget.gluten;
    const starterProtein =
      bread.starter.protein * starterFlour(recipe, bread.starter.hydration);
    const flourProtein = recipe.flour
      .map((v) => proteinOfFlour(bread, v.name) * v.amount)
      .reduce((a, b) => a + b, 0);
    return (
      (glutenProtein + starterProtein + flourProtein) /
      totalFlourWeight(recipe, bread.starter.hydration)
    );
  };

  test("basic bread should have no extra gluten", () => {
    const bread = createBasicBread();
    const recipe = compute(bread)._unsafeUnwrap();
    expect(recipe.gluten).toEqual(undefined);
  });

  test("protein target should be reached", () => {
    const bread = addProteinTarget(createBasicBread());
    const recipe = compute(bread)._unsafeUnwrap();

    expect(recipe.gluten).toBeTruthy();
    expect(protein(bread, recipe)).toBeCloseTo(bread.proteinTarget.target, 5);
  });

  test("protein target should be reached for multiple flours", () => {
    const bread = addProteinTarget(addFlours(createBasicBread()));
    const recipe = compute(bread)._unsafeUnwrap();

    expect(recipe.gluten).toBeTruthy();
    expect(protein(bread, recipe)).toBeCloseTo(bread.proteinTarget.target, 5);
  });
});

// TODO test failure cases
