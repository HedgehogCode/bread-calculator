import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Recipe } from "../../types";
import RecipeTable from "../RecipeTable";

const recipe = (params?: { gluten?: boolean }): Recipe => ({
  water: 100.14,
  salt: 10.05,
  starter: {
    name: "test starter",
    amount: 20.15,
  },
  gluten: params?.gluten ? 30.049999 : undefined,
  flour: [
    {
      name: "test flour 1",
      amount: 40.0222,
    },
    {
      name: "test flour 2",
      amount: 0.1,
    },
  ],
});

describe("RecipeTable", () => {
  afterEach(() => {
    cleanup();
  });

  describe("table head", () => {
    it("should render table head", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const thead = table.children[0];
      expect(thead).toBeVisible();
      expect(thead).toContainHTML("<thead>");
      expect(thead.children.length).toBe(1);

      const trow = thead.children[0];
      expect(trow).toBeVisible();
      expect(trow).toContainHTML("<tr>");
      expect(trow.children.length).toBe(2);

      const ingredientHeader = trow.children[0];
      expect(ingredientHeader).toBeVisible();
      expect(ingredientHeader).toContainHTML("<th>");
      expect(ingredientHeader).toHaveTextContent("Ingredient");

      const amountHeader = trow.children[1];
      expect(amountHeader).toBeVisible();
      expect(amountHeader).toContainHTML("<th>");
      expect(amountHeader).toHaveTextContent("Amount");
    });
  });

  describe("table body", () => {
    it("should render table body", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      expect(tbody).toBeVisible();
      expect(tbody).toContainHTML("<tbody>");
    });

    it("should render water row", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      const row = tbody.children[0];
      expect(row).toBeVisible();
      expect(row).toContainHTML("<tr>");
      expect(row.children.length).toBe(2);

      const ingredientCell = row.children[0];
      expect(ingredientCell).toBeVisible();
      expect(ingredientCell).toContainHTML("<td>");
      expect(ingredientCell).toHaveTextContent("Water");

      const amountCell = row.children[1];
      expect(amountCell).toBeVisible();
      expect(amountCell).toContainHTML("<td>");
      expect(amountCell).toHaveTextContent("100.1 g");
    });

    it("should render salt row", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      const row = tbody.children[1];
      expect(row).toBeVisible();
      expect(row).toContainHTML("<tr>");
      expect(row.children.length).toBe(2);

      const ingredientCell = row.children[0];
      expect(ingredientCell).toBeVisible();
      expect(ingredientCell).toContainHTML("<td>");
      expect(ingredientCell).toHaveTextContent("Salt");

      const amountCell = row.children[1];
      expect(amountCell).toBeVisible();
      expect(amountCell).toContainHTML("<td>");
      expect(amountCell).toHaveTextContent("10.1 g");
    });

    it("should render starter row", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      const row = tbody.children[2];
      expect(row).toBeVisible();
      expect(row).toContainHTML("<tr>");
      expect(row.children.length).toBe(2);

      const ingredientCell = row.children[0];
      expect(ingredientCell).toBeVisible();
      expect(ingredientCell).toContainHTML("<td>");
      expect(ingredientCell).toHaveTextContent("Starter - test starter");

      const amountCell = row.children[1];
      expect(amountCell).toBeVisible();
      expect(amountCell).toContainHTML("<td>");
      expect(amountCell).toHaveTextContent("20.2 g");
    });

    it("should not render gluten row (if gluten undefined)", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      expect(tbody).not.toHaveTextContent("Gluten");
    });

    it("should render gluten row (if gluten defined)", () => {
      const renderResult = render(
        <RecipeTable recipe={recipe({ gluten: true })} />,
      );
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      const row = tbody.children[3];
      expect(row).toBeVisible();
      expect(row).toContainHTML("<tr>");
      expect(row.children.length).toBe(2);

      const ingredientCell = row.children[0];
      expect(ingredientCell).toBeVisible();
      expect(ingredientCell).toContainHTML("<td>");
      expect(ingredientCell).toHaveTextContent("Gluten");

      const amountCell = row.children[1];
      expect(amountCell).toBeVisible();
      expect(amountCell).toContainHTML("<td>");
      expect(amountCell).toHaveTextContent("30.0 g");
    });

    it("should render flour rows", () => {
      const renderResult = render(<RecipeTable recipe={recipe()} />);
      const table = renderResult.getByRole("table");
      const tbody = table.children[1];
      const row1 = tbody.children[3];
      expect(row1).toBeVisible();
      expect(row1).toContainHTML("<tr>");
      expect(row1.children.length).toBe(2);

      const ingredientCell1 = row1.children[0];
      expect(ingredientCell1).toBeVisible();
      expect(ingredientCell1).toContainHTML("<td>");
      expect(ingredientCell1).toHaveTextContent("Flour - test flour 1");

      const amountCell1 = row1.children[1];
      expect(amountCell1).toBeVisible();
      expect(amountCell1).toContainHTML("<td>");
      expect(amountCell1).toHaveTextContent("40.0 g");

      const row2 = tbody.children[4];
      expect(row2).toBeVisible();
      expect(row2).toContainHTML("<tr>");
      expect(row2.children.length).toBe(2);

      const ingredientCell2 = row2.children[0];
      expect(ingredientCell2).toBeVisible();
      expect(ingredientCell2).toContainHTML("<td>");
      expect(ingredientCell2).toHaveTextContent("Flour - test flour 2");

      const amountCell2 = row2.children[1];
      expect(amountCell2).toBeVisible();
      expect(amountCell2).toContainHTML("<td>");
      expect(amountCell2).toHaveTextContent("0.1 g");
    });
  });
});
