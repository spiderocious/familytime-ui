import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@icons': path.resolve(__dirname, 'src/ui/icons/index.ts'),
    },
  },
  server: {
    port: 5173,
    // Phones on the same network join by the host machine's address.
    host: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/*.test.ts'],
  },
});
