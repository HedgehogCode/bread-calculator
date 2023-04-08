import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  test: {
    coverage: {
      all: true,
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
  },
}));
