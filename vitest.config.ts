import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Dynamically switch include path based on the command being run
    include: process.env.VITEST_MODE === 'integration' 
      ? ['tests/integration/**/*.{test,spec}.{ts,tsx}']
      : ['tests/unit/**/*.{test,spec}.ts'],
    
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      // Threshold check as required by Section 17
      thresholds: {
        lines: 80,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});