

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

  plugins: [svelte()],
  css: { postcss: './postcss.config.cjs' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
