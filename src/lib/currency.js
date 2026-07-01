/**
 * Currency helpers. The app prices everything in Sri Lankan Rupees (Rs / LKR).
 * Use these instead of hard-coding a "$" so the display stays consistent.
 */
export const CURRENCY_LABEL = "LKR";
export const CURRENCY_SYMBOL = "Rs";

/**
 * Format an amount as Rupees, e.g. formatLKR(1500) => "Rs 1,500".
 * @param {number|string} amount
 * @returns {string}
 */
export function formatLKR(amount) {
  const value = Number(amount || 0);
  return `${CURRENCY_SYMBOL} ${value.toLocaleString("en-LK")}`;
}
