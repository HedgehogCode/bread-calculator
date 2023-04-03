import { ThemeProvider } from "@emotion/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import {
  Alert,
  AppBar,
  Container,
  CssBaseline,
  PaletteMode,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { handleDefaultsAjv, initialData, schema, uischema } from "./breadform";
import ColorModeSwitcher from "./components/ColorModeSwitcher";
import compute from "./compute";
import RecipeTable from "./RecipeTable";
import getTheme from "./theme";
import { Bread } from "./types";

function App() {
  // Color mode
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Data
  const [data, setData] = useState(initialData);

  // Errors
  const [errors, setErrors] = useState<any>("no errors");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bread Calculator
          </Typography>
          <ColorModeSwitcher
            mode={mode}
            onToggle={(newMode) => setMode(newMode)}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setData(data as Bread);
            setErrors(errors);
          }}
          ajv={handleDefaultsAjv}
        />
        <Alert severity="error">{JSON.stringify(errors)}</Alert>
        <Alert severity="info">{JSON.stringify(data)}</Alert>
        <Paper sx={{ p: 4, my: 4 }} elevation={5}>
          {compute(data).match(
            (recipe) => {
              return (
                <>
                  <Typography variant="h5" gutterBottom>
                    Recipe
                  </Typography>
                  <RecipeTable recipe={recipe} />
                </>
              );
            },
            (err) => {
              return <Alert severity="error">{err}</Alert>;
            }
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
