

import 'fabric';

declare module 'fabric' {
  namespace fabric {
    // Extend the base FabricObject interface
    interface FabricObject {
      /**
       * Custom property to identify specific objects like 'mockupBase' or 'printArea'.
       */
      name?: string; // Make it optional ('?') as not ALL fabric objects will have it
    }
  }
}

