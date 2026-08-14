import type { Expense, Person } from '../types'
import { formatMoney } from '../utils/money'
import { calculateBalances } from '../utils/balances'

type Props = {
  people: Person[]
  expenses: Expense[]
}

export default function Balances({
  people,
  expenses,
}: Props) {
  const balances = calculateBalances(people, expenses)

  return (
    <section>
      <h2>Balances</h2>

      {people.length === 0 ? (
        <p>Add people to see balances.</p>
      ) : (
        <ul>
          {balances.map(balance => {
            const className =
              balance.amount > 0
                ? 'balance-positive'
                : balance.amount < 0
                  ? 'balance-negative'
                  : 'balance-zero'

            return (
              <li key={balance.personId}>
                <strong>{balance.name}</strong>
                {' — '}

                <span className={className}>
                  {balance.amount > 0
                    ? `is owed ${formatMoney(balance.amount)}`
                    : balance.amount < 0
                      ? `owes ${formatMoney(
                          Math.abs(balance.amount)
                        )}`
                      : 'is settled up'}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}