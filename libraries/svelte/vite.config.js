import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  root: './src',
  base: './',
  plugins: [svelte()],
  build: {
    outDir: '../../__shared__/tests/harness/svelte',
    emptyOutDir: true,
    modulePreload: {
      polyfill: false,
    },
  }
})