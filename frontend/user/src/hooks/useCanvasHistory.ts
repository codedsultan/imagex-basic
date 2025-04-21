import { useEffect, useRef } from 'react';
import { debounce } from '../utils/debounce';
import type { Canvas } from 'fabric';

interface HistoryConfig { enabled: boolean; debounceTime: number; maxSize: number; }

export function useCanvasHistory(
    canvas: Canvas | null,
    onSave: (state: string) => void,
    config: HistoryConfig
  ) {
    const lastRef = useRef<string | null>(null);
    const debounced = useRef(debounce((s: string) => {
      if (s !== lastRef.current) { onSave(s); lastRef.current = s; }
    }, config.debounceTime)).current;

    useEffect(() => {
      if (!canvas || !config.enabled) return;
      const listener = () => debounced(JSON.stringify(canvas.toJSON()));
      canvas.on('object:modified', listener);
      canvas.on('object:added', listener);
      canvas.on('object:removed', listener);
      return () => {
        canvas.off('object:modified', listener);
        canvas.off('object:added', listener);
        canvas.off('object:removed', listener);
      };
    },
    []
    // [canvas, config.enabled, debounced] // causes 2 flickers on first render

);
  }
