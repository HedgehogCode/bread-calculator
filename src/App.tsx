import { createContext, useMemo, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import {
  CssBaseline,
  PaletteMode,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

import { schema, uischema, initialData } from "./breadform";
import RecipeTable from "./RecipeTable";
import compute from "./compute";
import getTheme from "./theme";
import ColorModeSwitcher from "./components/ColorModeSwitcher";

export const ColorModeContext = createContext({
  mode: "light" as PaletteMode,
  toggleColorMode: () => {},
});

function App() {
  // Color mode
  const [mode, setMode] = useState<PaletteMode>("light");
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
