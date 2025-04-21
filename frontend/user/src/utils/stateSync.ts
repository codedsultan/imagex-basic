/**
 * Persist a JSON string under a key in localStorage
 */
export function persistCanvasState(key: string, json: string): void {
    try { localStorage.setItem(key, json); } catch {}
  }

  /**
   * Load a JSON string by key from localStorage
   */
  export function loadCanvasState(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
  }
