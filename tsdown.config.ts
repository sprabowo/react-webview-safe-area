import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  deps: {
    neverBundle: true
  }
});