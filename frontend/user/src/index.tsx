import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const el = document.getElementById('app');
if (el) {
  createRoot(el).render(
    <App
      initialPage={JSON.parse(el.dataset.page as string)}
      resolveComponent={(name: string) =>
        import(`./pages/${name}`).then((module) => module.default)
      }
    />
  );
}
