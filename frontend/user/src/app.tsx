import '../css/app.css';
import './bootstrap';
// import './bootstrap';
import React, { useEffect } from 'react';

import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// import ErrorBoundary from '@/Components/ErrorBoundary';
import { router } from '@inertiajs/react';
// import { resolvePageComponent } from '../../shared/inertia-helpers';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';



const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create a wrapper component to include our error boundary
// const AppWithBoundary = ({ Component, ...page }: any) => {
//     useEffect(() => {
//       const onPopState = (event: PopStateEvent) => {
//         // If event.state exists and has a 'url', use it
//         // if (event.state && event.state?.url) {
//         //   router.visit(event.state?.url, {
//         //     preserveState: false,
//         //     preserveScroll: false,
//         //     replace: true,
//         //   });
//         // } else {
//           // Otherwise, fallback to a full reload to ensure a fresh state
//           window.location.reload();
//         // }
//       };

//       window.addEventListener('popstate', onPopState);
//       return () => window.removeEventListener('popstate', onPopState);
//     }, []);

//     // Use the page.key as a reset key for the error boundary (it changes on navigation)
//     return (
//       <ErrorBoundary resetKey={page.key}>
//         <Component {...page.props} />
//       </ErrorBoundary>
//     );
//   };

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        return resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        )
        // const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })

        // const path = `./Pages/${name}.tsx`
        // return resolvePageComponent(path, pages)
        // resolvePageComponent(
        //     `./Pages/${name}.tsx`,
        //     import.meta.glob('./Pages/**/*.tsx'),
        // ),
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
        // root.render(<AppWithBoundary Component={App} {...props} />);

        // root.render(<AppWithBoundary Component={App} pageProps={props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
