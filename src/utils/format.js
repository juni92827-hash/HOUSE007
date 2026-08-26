export function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}
