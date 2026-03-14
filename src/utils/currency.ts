export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


export function getProgressPercentage(paid: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((paid / total) * 100), 100);
}
