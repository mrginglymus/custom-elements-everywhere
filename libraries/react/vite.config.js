import {defineConfig} from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  build: {
    outDir: '../../__shared__/tests/harness/react',
    emptyOutDir: true,
    modulePreload: {
      polyfill: false,
    },
  }
})