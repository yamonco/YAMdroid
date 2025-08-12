import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  css: { postcss: './postcss.config.cjs' },
});
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
  server: {
    hmr: {
      overlay: false,
    },
  },
});
