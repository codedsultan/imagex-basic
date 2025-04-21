import { defineConfig, PluginOption,ServerOptions } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Fix path resolution for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the Laravel root .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });
const host = process.env.APP_DOMAIN || 'localhost';
export default defineConfig({
  define: {
    'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
    'process.env.USER_VITE_PORT' : JSON.stringify(process.env.USER_VITE_PORT),
  },

  server: {
    port: Number(process.env.USER_VITE_PORT) || 5176,
    cors: true,
    host: host,
    hmr: {
      overlay: true,
    //   host: 'imagex-basic.test',
      host: 'localhost',
      protocol: 'ws',
    },
  },

  plugins: [
    laravel({
    //   detectTls: 'imagex-basic.test',
    //   enforceHttps: true,
      input: 'src/app.tsx', // Entry file relative to frontend/user-frontend folder
      refresh: true,
      buildDirectory: 'build/user', // ✅ Places assets inside `public/build/user`
      hotFile: path.resolve(__dirname, '../../public/hot-user'), // Ensures hotfile is correctly located
    } as any) as PluginOption,
    react(),
    tsconfigPaths(),
  ] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      'ziggy-js': path.resolve(__dirname, '../../vendor/tightenco/ziggy'),
      '@uppy/drag-drop': path.resolve(__dirname, 'node_modules/@uppy/drag-drop'),
      '@uppy/dashboard': path.resolve(__dirname, 'node_modules/@uppy/dashboard'),
      '@uppy/progress-bar': path.resolve(__dirname, 'node_modules/@uppy/progress-bar'),
      '@uppy/file-input': path.resolve(__dirname, 'node_modules/@uppy/file-input'),
    },
    extensions: [".js", ".jsx", ".json", ".vue", ".ts", ".tsx", ".mjs", ".mts"],
  },
  build: {
    outDir: path.resolve(__dirname, '../../public/build/user'),
    emptyOutDir: true,
    manifest: 'user-manifest.json',
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@uppy/drag-drop', '@uppy/dashboard', '@uppy/progress-bar', '@uppy/file-input'],
  },
});
