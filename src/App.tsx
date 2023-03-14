import { useState } from "react";
import Container from "@mui/material/Container";

import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

import { schema, uischema, initialData } from "./breadform";
import RecipeTable from "./RecipeTable";
import compute from "./compute";
import { Paper, Typography } from "@mui/material";

function App() {
  const [data, setData] = useState(initialData);

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }} elevation={5}>
        <Typography variant="h4" gutterBottom>
          Bread
        </Typography>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => setData(data)}
        />
      </Paper>
      <Paper sx={{ p: 4, mb: 4 }} elevation={5}>
        <Typography variant="h4" gutterBottom>
          Recipe
        </Typography>
        <RecipeTable recipe={compute(data)} />
      </Paper>
    </Container>
  );
}

export default App;
