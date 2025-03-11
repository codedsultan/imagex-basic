import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Create a simple memoization cache
const cache = new Map<string, string>();
const MAX_CACHE_SIZE = 100; // Limit the cache size to prevent memory leaks

/**
 * Optimized utility for merging class names with TailwindCSS
 * Uses memoization to cache results and improve performance for repeated calls
 */
export function cn(...args: unknown[]): string {
  // Create a cache key from the arguments
  const cacheKey = JSON.stringify(args);

  // Check if we have a cached result
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as string;
  }

  // Process the arguments as before
  const classes = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }

      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }

      return '';
    })
    .flat();

  // Generate the result
  const result = clsx(twMerge(...classes));

  // Store in cache, but ensure we don't exceed the max cache size
  if (cache.size >= MAX_CACHE_SIZE) {
    // Delete the oldest entry (first item in the Map)
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  cache.set(cacheKey, result);

  return result;
}
