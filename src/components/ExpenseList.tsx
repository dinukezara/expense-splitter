import type { Expense, Person } from '../types'
import { formatMoney } from '../utils/money'

type Props = {
  expenses: Expense[]
  people: Person[]
  onDeleteExpense: (expenseId: string) => void
  onEditExpense: (expense: Expense) => void
}

export default function ExpenseList({
  expenses,
  people,
  onDeleteExpense,
  onEditExpense,
}: Props) {
  function getPersonName(personId: string) {
    return (
      people.find(person => person.id === personId)?.name ??
      'Unknown'
    )
  }

  return (
    <section>
      <h2>Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul>
          {expenses.map(expense => (
            <li key={expense.id}>
              <div>
                <strong>{expense.description}</strong>
              </div>

              <div>
                Amount: {formatMoney(expense.amount)}
              </div>

              <div>
                Paid by: {getPersonName(expense.paidBy)}
              </div>

              <div>
                Split type:{' '}
                {expense.splitType === 'equal'
                  ? 'Equal'
                  : 'Exact Amount'}
              </div>

              <div>
                Split between:
                <ul>
                  {expense.splits.map(split => (
                    <li key={split.personId}>
                      {getPersonName(split.personId)}
                      {' — '}
                      {formatMoney(split.amount)}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onEditExpense(expense)}
                >
                Edit
                </button>

                <button
                type="button"
                onClick={() => onDeleteExpense(expense.id)}
                >
                Delete
                </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}