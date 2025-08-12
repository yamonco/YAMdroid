import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        a11y: false,
      },
    }),
  ],
  base: "./", // Use relative paths for electron
  build: {
    outDir: "../dist/renderer/",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
