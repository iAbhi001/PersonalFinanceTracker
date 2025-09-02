// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure Vite resolves the correct styled-engine
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
  build: {
    target: "esnext", // modern JS output
    minify: "esbuild",
  },
});
