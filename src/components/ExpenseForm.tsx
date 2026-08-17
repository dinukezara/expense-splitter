import { useEffect, useState } from 'react'
import type { Expense, Person } from '../types'
import { toCents } from '../utils/money'
import { equalSplit } from '../utils/split'

type Props = {
  people: Person[]
  onAddExpense: (expense: Expense) => void
  editingExpense?: Expense | null
  onUpdateExpense?: (expense: Expense) => void
  onCancelEdit?: () => void
}

export default function ExpenseForm({
  people,
  onAddExpense,
  editingExpense = null,
  onUpdateExpense,
  onCancelEdit,
}: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [splitType, setSplitType] = useState<'equal' | 'exact'>('equal')
  const [error, setError] = useState('')
  const [exactAmounts, setExactAmounts] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    if (!editingExpense) {
      return
    }

    setDescription(editingExpense.description)
    setAmount(String(editingExpense.amount / 100))
    setPaidBy(editingExpense.paidBy)

    setSelectedPeople(
      editingExpense.splits.map(split => split.personId)
    )

    setSplitType(editingExpense.splitType)

    if (editingExpense.splitType === 'exact') {
      const amounts: Record<string, string> = {}

      editingExpense.splits.forEach(split => {
        amounts[split.personId] = String(split.amount / 100)
      })

      setExactAmounts(amounts)
    } else {
      setExactAmounts({})
    }

    setError('')
  }, [editingExpense])

  function togglePerson(personId: string) {
    setSelectedPeople(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    )

    setExactAmounts(prev => {
      if (selectedPeople.includes(personId)) {
        const updated = { ...prev }
        delete updated[personId]
        return updated
      }

      return prev
    })

    setError('')
  }

  function updateExactAmount(
    personId: string,
    value: string
  ) {
    setExactAmounts(prev => ({
      ...prev,
      [personId]: value,
    }))

    setError('')
  }

  function resetForm() {
    setDescription('')
    setAmount('')
    setPaidBy('')
    setSelectedPeople([])
    setSplitType('equal')
    setExactAmounts({})
    setError('')
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    setError('')

    const trimmedDescription = description.trim()

    if (!trimmedDescription) {
      setError('Enter a description.')
      return
    }

    const amountNumber = Number(amount)

    if (
      !amount ||
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0
    ) {
      setError('Enter a valid amount greater than zero.')
      return
    }

    const totalCents = toCents(amount)

    if (totalCents <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }

    if (!paidBy) {
      setError('Select who paid.')
      return
    }

    if (selectedPeople.length === 0) {
      setError('Select at least one participant.')
      return
    }

    let splits: Expense['splits']

    if (splitType === 'equal') {
      splits = equalSplit(
        totalCents,
        selectedPeople
      )
    } else {
      const hasInvalidExactAmount =
        selectedPeople.some(personId => {
          const value =
            exactAmounts[personId] ?? ''

          const numberValue = Number(value)

          return (
            value === '' ||
            !Number.isFinite(numberValue) ||
            numberValue < 0
          )
        })

      if (hasInvalidExactAmount) {
        setError(
          'Enter a valid non-negative exact amount for every participant.'
        )
        return
      }

      splits = selectedPeople.map(
        personId => ({
          personId,
          amount: toCents(
            exactAmounts[personId] || '0'
          ),
        })
      )

      const splitTotal = splits.reduce(
        (sum, split) =>
          sum + split.amount,
        0
      )

      if (splitTotal !== totalCents) {
        setError(
          'Exact split amounts must equal the total expense.'
        )
        return
      }
    }

    const expense: Expense = {
      id:
        editingExpense?.id ??
        crypto.randomUUID(),
      description: trimmedDescription,
      amount: totalCents,
      paidBy,
      splitType,
      splits,
    }

    if (
      editingExpense &&
      onUpdateExpense
    ) {
      onUpdateExpense(expense)
    } else {
      onAddExpense(expense)
    }

    resetForm()
  }

  const allocatedCents =
    splitType === 'exact'
      ? selectedPeople.reduce(
          (sum, personId) => {
            const value =
              exactAmounts[personId] || '0'

            const numberValue =
              Number(value)

            if (
              !Number.isFinite(numberValue) ||
              numberValue < 0
            ) {
              return sum
            }

            return sum + toCents(value)
          },
          0
        )
      : 0

  const totalCents =
    amount &&
    Number.isFinite(Number(amount)) &&
    Number(amount) > 0
      ? toCents(amount)
      : 0

  const remainingCents =
    totalCents - allocatedCents

  return (
    <form
      className="card"
      onSubmit={handleSubmit}
    >
      <h2>
        {editingExpense
          ? 'Edit expense'
          : 'Log an expense'}
      </h2>

      {people.length < 2 ? (
        <p className="muted">
          Add at least two people before creating an expense.
        </p>
      ) : (
        <>
          <div className="grid2">
            <label>
              Description
              <input
                type="text"
                placeholder="Dinner"
                value={description}
                onChange={e => {
                  setDescription(e.target.value)
                  setError('')
                }}
              />
            </label>

            <label>
              Amount (LKR)
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="12000.00"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value)
                  setError('')
                }}
              />
            </label>
          </div>

          <div className="grid2">
            <label>
              Paid by
              <select
                value={paidBy}
                onChange={e => {
                  setPaidBy(e.target.value)
                  setError('')
                }}
              >
                <option value="">
                  Select payer
                </option>

                {people.map(person => (
                  <option
                    key={person.id}
                    value={person.id}
                  >
                    {person.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Split type
              <select
                value={splitType}
                onChange={e => {
                  setSplitType(
                    e.target.value as
                      | 'equal'
                      | 'exact'
                  )
                  setError('')
                }}
              >
                <option value="equal">
                  Equal split
                </option>
                <option value="exact">
                  Exact amounts
                </option>
              </select>
            </label>
          </div>

          <p className="label">
            Split between
          </p>

          <div className="grid2">
            {people.map(person => {
              const selected =
                selectedPeople.includes(
                  person.id
                )

              return (
                <div
                  className="pill"
                  key={person.id}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        togglePerson(
                          person.id
                        )
                      }
                    />

                    {person.name}
                  </label>

                  {selected &&
                  splitType === 'exact' ? (
                    <input
                      className="mini"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={
                        exactAmounts[
                          person.id
                        ] || ''
                      }
                      onChange={e =>
                        updateExactAmount(
                          person.id,
                          e.target.value
                        )
                      }
                    />
                  ) : null}
                </div>
              )
            })}
          </div>

          {splitType === 'exact' && (
            <div className="item">
              <p className="muted small">
                Total: LKR{' '}
                {(totalCents / 100).toFixed(2)}
              </p>

              <p className="muted small">
                Allocated: LKR{' '}
                {(allocatedCents / 100).toFixed(2)}
              </p>

              <p className="muted small">
                Remaining: LKR{' '}
                {(remainingCents / 100).toFixed(2)}
              </p>
            </div>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <div className="row">
            <button type="submit">
              {editingExpense
                ? 'Save changes'
                : 'Add expense'}
            </button>

            {editingExpense && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  resetForm()
                  onCancelEdit?.()
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </form>
  )
}