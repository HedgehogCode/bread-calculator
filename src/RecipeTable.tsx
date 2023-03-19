import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Recipe } from "./types";

interface RecipeTableProps {
  recipe: Recipe;
}

export default function RecipeTable(props: RecipeTableProps) {
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
            <TableCell>{props.recipe.water.toFixed(1)} g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Salt</TableCell>
            <TableCell>{props.recipe.salt.toFixed(1)} g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Starter - {props.recipe.starter[0].name}</TableCell>
            <TableCell>{props.recipe.starter[1].toFixed(1)} g</TableCell>
          </TableRow>
          {props.recipe.gluten ? (
            <TableRow>
              <TableCell>Gluten</TableCell>
              <TableCell>{props.recipe.gluten.toFixed(1)} g</TableCell>
            </TableRow>
          ) : (
            <></>
          )}
          {props.recipe.flour.map((flour) => {
            return (
              // TODO make sure the name is always unique
              <TableRow key={flour[0].name}>
                <TableCell>Flour - {flour[0].name}</TableCell>
                <TableCell>{flour[1].toFixed(1)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
