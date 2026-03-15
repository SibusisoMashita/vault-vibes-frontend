import { safeNumber } from './financial';

export function formatCurrency(amount: number | null | undefined): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeNumber(amount));
}

export function getProgressPercentage(paid: number | null | undefined, total: number | null | undefined): number {
  const safePaid  = safeNumber(paid);
  const safeTotal = safeNumber(total);
  if (safeTotal === 0) return 0;
  return Math.min(Math.round((safePaid / safeTotal) * 100), 100);
}
