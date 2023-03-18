import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export default function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: { mode },
  });
}
