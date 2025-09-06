import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'back-end/**/*.{test,spec}.{js,ts}',
      'tests/unit/**/*.{test,spec}.{js,ts}',
      'tests/integration/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'cypress',
      'front-end',
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'back-end/src'),
      '@shared': resolve(__dirname, 'shared'),
    }
  }
})