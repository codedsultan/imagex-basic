import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // The source folder for the Vue app:
  root: './src',
  base: '/build/admin-frontend/',
  build: {
    // Output to Laravel's public directory:
    outDir: '../../public/build/admin-frontend',
    emptyOutDir: true,
  },
});
