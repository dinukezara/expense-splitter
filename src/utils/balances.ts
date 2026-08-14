import type { Expense, Person } from '../types'

export type Balance = {
  personId: string
  name: string
  amount: number
}

export function calculateBalances(
  people: Person[],
  expenses: Expense[]
): Balance[] {
  const balances: Record<string, number> = {}

  // Every person starts at zero.
  people.forEach(person => {
    balances[person.id] = 0
  })

  expenses.forEach(expense => {
    // The payer paid the full expense,
    // so they are credited the full amount.
    balances[expense.paidBy] += expense.amount

    // Each participant owes their allocated share.
    expense.splits.forEach(split => {
      balances[split.personId] -= split.amount
    })
  })

  return people.map(person => ({
    personId: person.id,
    name: person.name,
    amount: balances[person.id] ?? 0,
  }))
}