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

export default function RecipeTable({ recipe }: RecipeTableProps) {
  // return <span>{JSON.stringify(props.recipe)}</span>;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="recipe">
        <TableHead>
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Water</TableCell>
            <TableCell>{recipe.water.toFixed(1)} g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Salt</TableCell>
            <TableCell>{recipe.salt.toFixed(1)} g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Starter - {recipe.starter.name}</TableCell>
            <TableCell>{recipe.starter.amount.toFixed(1)} g</TableCell>
          </TableRow>
          {recipe.gluten ? (
            <TableRow>
              <TableCell>Gluten</TableCell>
              <TableCell>{recipe.gluten.toFixed(1)} g</TableCell>
            </TableRow>
          ) : (
            <></>
          )}
          {recipe.flour.map((flour) => {
            return (
              // TODO make sure the name is always unique
              <TableRow key={flour.name}>
                <TableCell>Flour - {flour.name}</TableCell>
                <TableCell>{flour.amount.toFixed(1)} g</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
