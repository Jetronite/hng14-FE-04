import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, 'src/tests/e2e/**'],
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the "@" selector to your "src" directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});

