import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

import { schema, uischema, initialData } from "./breadform";

function App() {
  const [data, setData] = useState(initialData);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => setData(data)}
        />
      </Box>
    </Container>
  );
}

export default App;
