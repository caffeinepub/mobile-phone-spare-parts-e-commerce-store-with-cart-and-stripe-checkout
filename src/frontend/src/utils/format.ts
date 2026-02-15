export function formatPrice(priceInCents: number, currency: string = 'USD'): string {
  const amount = priceInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
