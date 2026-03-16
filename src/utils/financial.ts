/**
 * Returns 0 for any non-finite value (NaN, Infinity, null, undefined).
 */
export function safeNumber(value?: number | null): number {
  if (value === null || value === undefined) return 0;
  if (!Number.isFinite(value)) return 0;
  return value;
}

/**
 * Divides a by b, returning 0 when b is 0, null, or undefined.
 */
export function safeDivide(a?: number | null, b?: number | null): number {
  const sa = safeNumber(a);
  const sb = safeNumber(b);
  if (sb === 0) return 0;
  return sa / sb;
}

/**
 * Returns a percentage string. Safe against null/undefined/NaN.
 */
export function formatPercent(value?: number | null): string {
  return `${safeNumber(value).toFixed(2)}%`;
}
