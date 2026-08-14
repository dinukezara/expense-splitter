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

    const payerExists = people.some(
      person => person.id === paidBy
    )

    if (!payerExists) {
      setError('The selected payer no longer exists.')
      return
    }

    if (selectedPeople.length === 0) {
      setError('Select at least one participant.')
      return
    }

    const allParticipantsExist =
      selectedPeople.every(personId =>
        people.some(person => person.id === personId)
      )

    if (!allParticipantsExist) {
      setError(
        'One or more selected participants no longer exist.'
      )
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
              !Number.isFinite(
                numberValue
              ) ||
              numberValue < 0
            ) {
              return sum
            }

            return (
              sum + toCents(value)
            )
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
    <section>
      <h2>
        {editingExpense
          ? 'Edit Expense'
          : 'Add Expense'}
      </h2>

      {people.length < 2 ? (
        <p>
          Add at least two people before
          creating an expense.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Description
              <input
                type="text"
                placeholder="e.g. Dinner"
                value={description}
                onChange={e => {
                  setDescription(
                    e.target.value
                  )
                  setError('')
                }}
              />
            </label>
          </div>

          <div>
            <label>
              Amount (LKR)
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 12000"
                value={amount}
                onChange={e => {
                  setAmount(
                    e.target.value
                  )
                  setError('')
                }}
              />
            </label>
          </div>

          <div>
            <label>
              Who paid?
              <select
                value={paidBy}
                onChange={e => {
                  setPaidBy(
                    e.target.value
                  )
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
          </div>

          <div>
            <p>Split between</p>

            {people.map(person => (
              <label key={person.id}>
                <input
                  type="checkbox"
                  checked={selectedPeople.includes(
                    person.id
                  )}
                  onChange={() =>
                    togglePerson(
                      person.id
                    )
                  }
                />

                {person.name}
              </label>
            ))}
          </div>

          <div>
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
                  Equal Split
                </option>

                <option value="exact">
                  Exact Amount
                </option>
              </select>
            </label>
          </div>

          {splitType === 'exact' && (
            <div>
              <h3>Exact amounts</h3>

              {selectedPeople.length ===
              0 ? (
                <p>
                  Select participants
                  first.
                </p>
              ) : (
                selectedPeople.map(
                  personId => {
                    const person =
                      people.find(
                        p =>
                          p.id ===
                          personId
                      )

                    return (
                      <div
                        key={personId}
                      >
                        <label>
                          {person?.name}

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={
                              exactAmounts[
                                personId
                              ] || ''
                            }
                            onChange={e =>
                              updateExactAmount(
                                personId,
                                e.target
                                  .value
                              )
                            }
                          />
                        </label>
                      </div>
                    )
                  }
                )
              )}

              <div>
                <p>
                  Expense total:{' '}
                  LKR{' '}
                  {(
                    totalCents / 100
                  ).toFixed(2)}
                </p>

                <p>
                  Allocated:{' '}
                  LKR{' '}
                  {(
                    allocatedCents /
                    100
                  ).toFixed(2)}
                </p>

                <p>
                  Remaining:{' '}
                  LKR{' '}
                  {(
                    remainingCents /
                    100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          <button type="submit">
            {editingExpense
              ? 'Save Changes'
              : 'Add Expense'}
          </button>

          {editingExpense && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                onCancelEdit?.()
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}
    </section>
  )
}