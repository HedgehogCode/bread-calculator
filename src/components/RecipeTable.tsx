import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Recipe } from "../types";

interface RecipeTableProps {
  recipe: Recipe;
}

const renderWeight = (value: number) => {
  return `${(Math.round(value * 10) / 10).toFixed(1)} g`;
};

export default function RecipeTable({ recipe }: RecipeTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="recipe">
        <TableHead data-testid="table-head">
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Water</TableCell>
            <TableCell>{renderWeight(recipe.water)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Salt</TableCell>
            <TableCell>{renderWeight(recipe.salt)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Starter - {recipe.starter.name}</TableCell>
            <TableCell>{renderWeight(recipe.starter.amount)}</TableCell>
          </TableRow>
          {recipe.gluten ? (
            <TableRow>
              <TableCell>Gluten</TableCell>
              <TableCell>{renderWeight(recipe.gluten)}</TableCell>
            </TableRow>
          ) : (
            <></>
          )}
          {recipe.flour.map((flour) => {
            return (
              <TableRow key={flour.name}>
                <TableCell>Flour - {flour.name}</TableCell>
                <TableCell>{renderWeight(flour.amount)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
