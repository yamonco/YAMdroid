import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css: { postcss: "./postcss.config.cjs" },
  plugins: [svelte()],
  base: "./", // Use relative paths for electron
  build: {
    outDir: "../dist/renderer/",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
