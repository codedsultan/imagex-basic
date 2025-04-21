import { useEffect } from 'react';

/**
 * Hook that calls `callback` on size changes of a ref element.
 */
export function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: (size: { width: number; height: number }) => void
) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      callback({ width, height });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  },
//   []
//    [ref, callback]
  );
}
