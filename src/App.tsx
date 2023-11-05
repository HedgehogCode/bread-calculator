import { ThemeProvider } from "@emotion/react";
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

import BreadForm from "./components/BreadForm";
import ColorModeSwitcher from "./components/ColorModeSwitcher";
import RecipeTable from "./components/RecipeTable";
import compute from "./compute";
import initialData from "./initialData";
import getTheme from "./theme";

function App() {
  // Color mode
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Data
  const [data, setData] = useState(initialData);

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
        <BreadForm onChange={setData} />
        {/* <Alert severity="info">{JSON.stringify(data, null, 2)}</Alert> */}
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
            },
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
