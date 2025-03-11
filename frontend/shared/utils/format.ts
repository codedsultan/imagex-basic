/**
 * Format seconds into a readable time string (e.g., "2h 30m 45s" or "30m 45s" or "45s")
 *
 * @param {number} seconds - The number of seconds to format
 * @returns {string} The formatted time string
 */
export function formatSecondsToTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let result = '';

  if (hours > 0) {
    result += `${hours}h `;
  }

  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }

  result += `${remainingSeconds}s`;

  return result.trim();
}

/**
 * Format a number with commas as thousands separators
 *
 * @param {number} num - The number to format
 * @returns {string} The formatted number string
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a percentage value with a % symbol and optional decimal places
 *
 * @param {number} value - The value to format as percentage
 * @param {number} [decimalPlaces=0] - Number of decimal places to include
 * @returns {string} The formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number = 0): string {
  return `${value.toFixed(decimalPlaces)}%`;
}
