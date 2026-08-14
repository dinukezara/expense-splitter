import { useState } from 'react'
import type { Expense, Person } from './types'

import PeopleSection from './components/PeopleSection'
import ExpenseForm from './components/ExpenseForm'
import Balances from './components/Balances'
import ExpenseList from './components/ExpenseList'
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

    if (!trimmed) {
      return
    }

    const alreadyExists = people.some(
      person =>
        person.name.toLowerCase() ===
        trimmed.toLowerCase()
    )

    if (alreadyExists) {
      return
    }

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

    if (!trimmed) {
      return
    }

    const duplicate = people.some(
      person =>
        person.id !== personId &&
        person.name.toLowerCase() ===
          trimmed.toLowerCase()
    )

    if (duplicate) {
      return
    }

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
      expense => {
        const isPayer =
          expense.paidBy === personId

        const isParticipant =
          expense.splits.some(
            split =>
              split.personId === personId
          )

        return isPayer || isParticipant
      }
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

  function startEditingExpense(
    expense: Expense
  ) {
    setEditingExpense(expense)
  }

  function cancelEditingExpense() {
    setEditingExpense(null)
  }

  return (
    <main>
      <h1>Expense Splitter</h1>

      <div className="dashboard">
        <PeopleSection
          people={people}
          onAddPerson={addPerson}
          onRenamePerson={
            renamePerson
          }
          onDeletePerson={
            deletePerson
          }
        />

        <ExpenseForm
          people={people}
          onAddExpense={addExpense}
          editingExpense={
            editingExpense
          }
          onUpdateExpense={
            updateExpense
          }
          onCancelEdit={
            cancelEditingExpense
          }
        />

        <div className="full-width">
          <ExpenseList
            expenses={expenses}
            people={people}
            onDeleteExpense={
              deleteExpense
            }
            onEditExpense={
              startEditingExpense
            }
          />
        </div>

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
      </div>
    </main>
  )
}

export default App