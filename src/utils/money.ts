export function toCents(value: string) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return 0
  }

  return Math.round(amount * 100)
}

const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(cents: number) {
  return lkrFormatter.format(cents / 100)
}