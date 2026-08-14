import type { Balance } from './balances'

export type Settlement = {
  fromPersonId: string
  toPersonId: string
  amount: number
}

export function calculateSettlements(
  balances: Balance[]
): Settlement[] {
  const creditors = balances
    .filter(item => item.amount > 0)
    .map(item => ({
      personId: item.personId,
      amount: item.amount,
    }))

  const debtors = balances
    .filter(item => item.amount < 0)
    .map(item => ({
      personId: item.personId,
      amount: Math.abs(item.amount),
    }))

  const settlements: Settlement[] = []

  let creditorIndex = 0
  let debtorIndex = 0

  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]

    const amount = Math.min(
      creditor.amount,
      debtor.amount
    )

    settlements.push({
      fromPersonId: debtor.personId,
      toPersonId: creditor.personId,
      amount,
    })

    creditor.amount -= amount
    debtor.amount -= amount

    if (creditor.amount === 0) {
      creditorIndex++
    }

    if (debtor.amount === 0) {
      debtorIndex++
    }
  }

  return settlements
}