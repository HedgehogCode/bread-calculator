import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton, PaletteMode } from "@mui/material";

interface ColorModeSwitcherProps {
  mode: PaletteMode;
  onToggle: (mode: PaletteMode) => void;
}

export default function ColorModeSwitcher({
  mode,
  onToggle,
}: ColorModeSwitcherProps) {
  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={() => onToggle(mode === "dark" ? "light" : "dark")}
      color="inherit"
    >
      {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
