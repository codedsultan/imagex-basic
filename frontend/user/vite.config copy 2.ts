import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Fix path resolution for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
    define: {
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
    },
    server: {
        cors: true,
        hmr: {
            overlay: true,
            host: 'localhost',
            protocol: 'ws'
        }
    },
    plugins: [
       
        laravel({
            input: 'src/app.tsx',  // Path relative to frontend/user-frontend
            refresh: true,
            publicDirectory: '../../public', // Path to Laravel's public directory
            buildDirectory: 'build', // Subdirectory in public where assets will go
            hotFile: '../../public/hot', // Path to the hot file
        }),
        react(),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
            'ziggy-js': path.resolve(__dirname, '../../vendor/tightenco/ziggy'),
        },
        extensions: [".js", ".jsx", ".json", ".vue", ".ts", ".tsx", ".mjs", ".mts"],
    },
    build: {
        outDir: path.resolve(__dirname, '../../public/build/user'),
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