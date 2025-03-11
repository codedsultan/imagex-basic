
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';


import { fileURLToPath } from 'url';


// Fix path resolution for ESM
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
export default defineConfig({
    define: {
        // Optionally expose APP_URL to your client-side code if needed:
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
    },

    server: {
        hmr: {
            overlay: true,
            host: 'localhost',
            protocol: 'ws'
        }
    },
    plugins: [
        laravel({
            input: 'src/app.tsx',
            refresh: true,
            hotFile: path.resolve(__dirname, '../../public/hot'),
        }),
        react(),

        // react({
        //     babel: {
        //         plugins: [['babel-plugin-react-compiler', { target: '18' }]]
        //     }
        // }),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            // "@": path.resolve(__dirname, '../../frontend/user-frontend'),
            "@": path.resolve(__dirname, './src'),
            'ziggy-js': path.resolve(__dirname, '../../vendor/tightenco/ziggy'),
        },
        extensions: [".js", ".jsx", ".json", ".vue", ".ts", ".tsx", ".mjs", ".mts"],
    },
    build: {
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

// export default defineConfig({
//     server: {
//         hmr: {
//             overlay: true,
//             host: 'localhost',
//             protocol: 'ws'
//         }
//       },
//     plugins: [
//         laravel({
//             input: 'src/App.tsx',
//             refresh: true,
//         }),
//         // react(),
//         react({
//             babel: {
//               plugins: [['babel-plugin-react-compiler', {
//                 target: '18'
//               }]]
//             }
//         }),

//         tsconfigPaths(),
//     ],

//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, '../../frontend/user-frontend'),
//             'ziggy-js': path.resolve(__dirname, '../../vendor/tightenco/ziggy'),
//         },
//         extensions: [".js", ".jsx", ".json", ".vue", ".ts", ".tsx", ".mjs", ".mts"],
//     },

//     build: {
//         minify: true,
//         sourcemap: false,
//         rollupOptions: {
//             output: {
//                 manualChunks: (id) => {
//                     if (id.includes('node_modules')) {
//                         return 'vendor';
//                     }
//                 },
//             },
//         },
//     },
// });

// export default defineConfig({
//   plugins: [react()],
//   // The source folder for the React app:
//   root: './src',
//   // Base path can be adjusted as needed for Laravel:
//   base: '/build/user-frontend/',
//   build: {
//     // Output to Laravel's public directory:
//     outDir: '../../public/build/user-frontend',
//     emptyOutDir: true,
//   },
// });
