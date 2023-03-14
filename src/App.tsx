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
import { Typography } from "@mui/material";

function App() {
  const [data, setData] = useState(initialData);

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => setData(data)}
      />
      <Typography variant="h3" gutterBottom>
        Recipe
      </Typography>
      <RecipeTable recipe={compute(data)} />
    </Container>
  );
}

export default App;
