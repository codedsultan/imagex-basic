import { defineConfig, PluginOption } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Fix path resolution for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the Laravel root .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

export default defineConfig({
    define: {
        'process.env.APP_URL': JSON.stringify(process.env.ADMIN_CLIENT_URL),
    },
    server: {
        port: Number(process.env.ADMIN_VITE_PORT) || 5175,
        hmr: {
            overlay: true,
            host: 'localhost',
            protocol: 'ws',
        },
    },
    plugins: [
        laravel({
            input: 'src/app.ts', // Entry point relative to admin-frontend folder
            refresh: true,
            publicDirectory: '../../public', // Laravel's public folder
            buildDirectory: 'build/admin', // Assets will be built to public/build/admin
            hotFile: '../../public/hot-admin', // Location of the hot file
            // devServerUrl: process.env.ADMIN_CLIENT_URL || `http://localhost:${process.env.ADMIN_VITE_PORT || 5175}`,
            asset_url: process.env.ASSET_URL || `http://localhost:${process.env.ADMIN_VITE_PORT || 5175}/build/admin`,
        }as any) as PluginOption,
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
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
        outDir: path.resolve(__dirname, '../../public/build/admin'),
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
