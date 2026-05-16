/**
 * Formats a number as Pakistani Rupee (PKR).
 * Example: 45000 -> PKR 45,000
 */
export const formatPKR = (value: number | string | null | undefined): string => {
  const num = Number(value) || 0;
  return `PKR ${num.toLocaleString()}`;
};
