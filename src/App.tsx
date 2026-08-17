import { useState } from 'react'
import type { Expense, Person } from './types'

import PeopleSection from './components/PeopleSection'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Balances from './components/Balances'
import { Settlements } from './components/Settlements'

import { calculateBalances } from './utils/balances'
import { calculateSettlements } from './utils/settlements'
import { useLocalStorage } from './hooks/useLocalStorage'

import './App.css'

function App() {
  const [people, setPeople] = useLocalStorage<Person[]>(
    'people',
    []
  )

  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    'expenses',
    []
  )

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null)

  const balances = calculateBalances(
    people,
    expenses
  )

  const settlements =
    calculateSettlements(balances)

  function addPerson(name: string) {
    const trimmed = name.trim()

    if (!trimmed) return

    const alreadyExists = people.some(
      person =>
        person.name.toLowerCase() ===
        trimmed.toLowerCase()
    )

    if (alreadyExists) return

    setPeople(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmed,
      },
    ])
  }

  function renamePerson(
    personId: string,
    newName: string
  ) {
    const trimmed = newName.trim()

    if (!trimmed) return

    const duplicate = people.some(
      person =>
        person.id !== personId &&
        person.name.toLowerCase() ===
          trimmed.toLowerCase()
    )

    if (duplicate) return

    setPeople(prev =>
      prev.map(person =>
        person.id === personId
          ? {
              ...person,
              name: trimmed,
            }
          : person
      )
    )
  }

  function deletePerson(personId: string) {
    const isUsedInExpense = expenses.some(
      expense =>
        expense.paidBy === personId ||
        expense.splits.some(
          split =>
            split.personId === personId
        )
    )

    if (isUsedInExpense) {
      alert(
        'This person cannot be deleted because they are used in an existing expense.'
      )
      return
    }

    setPeople(prev =>
      prev.filter(
        person =>
          person.id !== personId
      )
    )
  }

  function addExpense(expense: Expense) {
    setExpenses(prev => [
      ...prev,
      expense,
    ])
  }

  function deleteExpense(
    expenseId: string
  ) {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this expense?'
      )

    if (!confirmed) return

    setExpenses(prev =>
      prev.filter(
        expense =>
          expense.id !== expenseId
      )
    )

    if (
      editingExpense?.id === expenseId
    ) {
      setEditingExpense(null)
    }
  }

  function updateExpense(
    updatedExpense: Expense
  ) {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id ===
        updatedExpense.id
          ? updatedExpense
          : expense
      )
    )

    setEditingExpense(null)
  }

  function resetAll() {
    const confirmed =
      window.confirm(
        'Reset all people and expenses?'
      )

    if (!confirmed) return

    setPeople([])
    setExpenses([])
    setEditingExpense(null)
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Expense Splitter</h1>

          <p className="muted">
            Add people → log expenses → view balances →
            settle up. All amounts in LKR.
          </p>
        </div>

        <button
          className="ghost"
          type="button"
          onClick={resetAll}
        >
          Reset
        </button>
      </header>

      <div className="layout">
        <div className="col">
          <PeopleSection
            people={people}
            onAddPerson={addPerson}
            onRenamePerson={renamePerson}
            onDeletePerson={deletePerson}
          />

          {people.length > 0 && (
            <ExpenseForm
              people={people}
              onAddExpense={addExpense}
              editingExpense={
                editingExpense
              }
              onUpdateExpense={
                updateExpense
              }
              onCancelEdit={() =>
                setEditingExpense(null)
              }
            />
          )}

          <ExpenseList
            expenses={expenses}
            people={people}
            onDeleteExpense={
              deleteExpense
            }
            onEditExpense={
              setEditingExpense
            }
          />
        </div>

        <aside className="col">
          <Balances
            people={people}
            expenses={expenses}
          />

          <Settlements
            people={people}
            settlements={
              settlements
            }
          />
        </aside>
      </div>
    </main>
  )
}

export default App