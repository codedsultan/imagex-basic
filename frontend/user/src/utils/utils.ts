import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  /**
   * Generates a unique ID (simple implementation for demonstration).
   */
  export function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
