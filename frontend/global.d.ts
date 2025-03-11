import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { PageProps as AppPageProps } from './index';
import { route as routeFn } from 'ziggy-js';

declare global {
    /* eslint-disable no-var */
    var route: typeof routeFn;
}

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}


// declare module 'vite/client' {
//     interface ImportMetaEnv {
//         VITE_GOOGLE_MAPS_API_KEY: string;
//     }
// }
