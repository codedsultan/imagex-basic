export async function resolvePageComponent(name, pages) {
    const namespaceDelimiter = '::';
    if (name.includes(namespaceDelimiter)) {
      // Split by "::" and keep only the part after it
      const parts = name.split(namespaceDelimiter);
      name = parts[1];
      console.log(name);
    }

    // Build the file path relative to the Vite root (which is './src')
    const path = `./Pages/${name}.tsx`;
    if (pages[path]) {
      return pages[path]().then(module => module.default);
    }
    throw new Error(`Page not found: ${name}`);
  }




async  function resolvePageComponentForReact(path, pages) {
    for (const p of (Array.isArray(path) ? path : [path])) {
        const page = pages[p];

        if (typeof page === 'undefined') {
            continue;
        }
        return typeof page === 'function' ? page() : page;
    }
    throw new Error(`Page not found: ${path}`);
}
