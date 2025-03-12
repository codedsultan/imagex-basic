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
const host = 'saas.imagex-basic.test';
export default defineConfig({
  define: {
    'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
    'process.env.ASSET_URL': JSON.stringify(process.env.ASSET_URL),
  },
  
  server: {
    // https: {
    //     key: fs.readFileSync(`/Users/tedbree-ayobami/Library/Application Support/Herd/config/valet/Certificates/${host}.key`),
    //     cert: fs.readFileSync(`/Users/tedbree-ayobami/Library/Application Support/Herd/config/valet/Certificates/${host}.crt`),
    // },
    // https:true,
    // https: {
        
    // },
    // cors: {  
    //     origin: [ 
    //         // Supports: SCHEME://DOMAIN.laravel[:PORT] 
    //         /^https?:\/\/.*\.laravel(:\d+)?$/, 
    //     ], 
    // }, 
    // https: {} as any,
    port: Number(process.env.USER_VITE_PORT) || 5177,
    strictPort: true,
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
    //   refresh: true,
    //   refresh: ['resources/views/**'],
      refresh: [{
        paths: ['resources/views/**','frontend/saas/src/**'],
        config: { delay: 300 }
    }],
      publicDirectory: '../../public', // Laravel's public directory
      buildDirectory: 'build', // Subdirectory in public where assets will go
      hotFile: '../../public/hot-saas', // Location of the hot file
    //   devServerUrl: 'https://imagex-basic.test:5176',
      asset_url: process.env.ASSET_URL || `https://localhost:${process.env.USER_VITE_PORT || 5177}/build/user`,
    } as any) as PluginOption,
    // react(),
    react({ 
        jsxRuntime: 'automatic', // Required for React Refresh
        // fastRefresh: true 
      }),
    tsconfigPaths(),
  ] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      'ziggy-js': path.resolve(__dirname, '../../vendor/tightenco/ziggy'),
    },
    extensions: [".js", ".jsx", ".json", ".vue", ".ts", ".tsx", ".mjs", ".mts"],
  },
  build: {
    outDir: path.resolve(__dirname, '../../public/build/saas'),
    emptyOutDir: true,
    manifest: true,
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
});
