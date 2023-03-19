import { ThemeProvider } from "@emotion/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import {
  AppBar,
  Container,
  CssBaseline,
  PaletteMode,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { createContext, useMemo, useState } from "react";

import { initialData, schema, uischema } from "./breadform";
import ColorModeSwitcher from "./components/ColorModeSwitcher";
import compute from "./compute";
import RecipeTable from "./RecipeTable";
import getTheme from "./theme";

export const ColorModeContext = createContext({});

function App() {
  // Color mode
  const [mode, setMode] = useState<PaletteMode>("dark");
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    [mode]
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Data
  const [data, setData] = useState(initialData);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bread Calculator
            </Typography>
            <ColorModeSwitcher />
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ my: 4 }}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data, errors }) => setData(data)}
          />
          <Paper sx={{ p: 4, my: 4 }} elevation={5}>
            <Typography variant="h5" gutterBottom>
              Recipe
            </Typography>
            <RecipeTable recipe={compute(data)} />
          </Paper>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
