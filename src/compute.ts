import linear from "linear-solve";
import { err, ok, Result } from "neverthrow";

import type { Bread, Flour, Recipe, Starter } from "./types";

function constArray(len: number, val: number) {
  return Array(len).fill(val) as number[];
}

function starterFlour(b: Bread) {
  return 1.0 / (1.0 + b.starter.hydration / 100.0);
}

function starterWater(b: Bread) {
  return 1.0 - starterFlour(b);
}

function numFlours(b: Bread) {
  // Main flour + additional flours
  return b.flours.length + 1;
}

function pushIfProteinTarget(b: Bread, a: number[], x: number) {
  if (b.useProteinTarget) {
    a.push(x);
  }
}

// ================= Conditions

function weightCondA(b: Bread) {
  return Array(numFlours(b) + (b.useProteinTarget ? 4 : 3)).fill(
    1.0
  ) as number[];
}

function weightCondB(b: Bread) {
  return b.totalWeight;
}

function hydrCondA(b: Bread) {
  const a = [
    1.0, // Water
    0.0, // Salt
    starterWater(b) - (b.hydration / 100.0) * starterFlour(b), // Starter
  ];
  pushIfProteinTarget(b, a, -b.hydration / 100.0);
  return a.concat(constArray(numFlours(b), -b.hydration / 100.0));
}

function hydrCondB() {
  return 0.0;
}

function saltCondA(b: Bread) {
  const a = [
    0.0, // Water
    1.0, // Salt
    (-b.saltPerc / 100.0) * starterFlour(b), // Starter
  ];
  pushIfProteinTarget(b, a, -b.saltPerc / 100.0);
  return a.concat(constArray(numFlours(b), -b.saltPerc / 100.0));
}

function saltCondB() {
  return 0.0;
}

function starterCondA(b: Bread) {
  const a = [0.0, 0.0, 1.0];
  pushIfProteinTarget(b, a, -b.starterPerc / 100.0);
  return a.concat(constArray(numFlours(b), -b.starterPerc / 100.0));
}

function starterCondB() {
  return 0.0;
}

function proteinCondA(b: Bread) {
  return [
    0.0,
    0.0,
    (b.starter.protein - b.proteinTarget.target) * starterFlour(b),
    b.proteinTarget.gluten - b.proteinTarget.target,
    b.mainFlour.protein - b.proteinTarget.target,
  ].concat(b.flours.map((f) => f.flour.protein - b.proteinTarget.target));
}

function proteinCondB() {
  return 0.0;
}

function flourCondA(b: Bread, idx: number) {
  const amount = b.flours[idx].amount / 100.0;
  let a = [0.0, 0.0, -amount * starterFlour(b)];
  pushIfProteinTarget(b, a, -amount);
  a = a.concat(constArray(numFlours(b), -amount));
  a[idx + (b.useProteinTarget ? 5 : 4)] += 1;
  return a;
}

function flourCondB() {
  return 0.0;
}

export default function compute(params: Bread): Result<Recipe, string> {
  // Variables:
  // x_0: Water
  // x_1: Salt
  // x_2: Starter
  // x_3: Gluten
  // x_4: Main flour
  // x_(5..n): Additional flours

  const a: number[][] = [];
  const b: number[] = [];

  // Weight
  a.push(weightCondA(params));
  b.push(weightCondB(params));

  // Hydration
  a.push(hydrCondA(params));
  b.push(hydrCondB());

  // Salt
  a.push(saltCondA(params));
  b.push(saltCondB());

  // Starter
  a.push(starterCondA(params));
  b.push(starterCondB());

  // Gluten
  if (params.useProteinTarget) {
    a.push(proteinCondA(params));
    b.push(proteinCondB());
  }

  // Flours
  for (let i = 0; i < params.flours.length; i++) {
    a.push(flourCondA(params, i));
    b.push(flourCondB());
  }

  // Solve the equation system
  let x: number[];
  try {
    x = linear.solve(a, b);
  } catch (e) {
    return err("No recipe can fulfill the given definition.");
  }

  // Construct the recipe
  const water = x[0];
  const salt = x[1];
  const starter: [Starter, number] = [params.starter, x[2]];

  if (params.useProteinTarget) {
    const mainFlour: [Flour, number] = [params.mainFlour, x[4]];

    return ok({
      water: water,
      salt: salt,
      starter: starter,
      gluten: x[3],
      flour: [mainFlour].concat(
        params.flours.map((f, i) => [f.flour, x[i + 5]])
      ),
    });
  } else {
    const mainFlour: [Flour, number] = [params.mainFlour, x[3]];
    return ok({
      water: x[0],
      salt: x[1],
      starter: starter,
      flour: [mainFlour].concat(
        params.flours.map((f, i) => [f.flour, x[i + 4]])
      ),
    });
  }
}
