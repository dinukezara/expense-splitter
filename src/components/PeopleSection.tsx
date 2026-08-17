import { useState } from 'react'
import type { Person } from '../types'

type Props = {
  people: Person[]
  onAddPerson: (name: string) => void
  onRenamePerson: (
    personId: string,
    newName: string
  ) => void
  onDeletePerson: (
    personId: string
  ) => void
}

export default function PeopleSection({
  people,
  onAddPerson,
  onRenamePerson,
  onDeletePerson,
}: Props) {
  const [name, setName] = useState('')
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [editingName, setEditingName] =
    useState('')

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!name.trim()) return

    onAddPerson(name)
    setName('')
  }

  function startEdit(person: Person) {
    setEditingId(person.id)
    setEditingName(person.name)
  }

  function saveEdit(
    personId: string
  ) {
    if (!editingName.trim()) return

    onRenamePerson(
      personId,
      editingName
    )

    setEditingId(null)
    setEditingName('')
  }

  return (
    <section className="card">
      <h2>People</h2>

      <form
        className="row"
        onSubmit={handleSubmit}
      >
        <input
          value={name}
          onChange={e =>
            setName(e.target.value)
          }
          placeholder="Add a name..."
        />

        <button type="submit">
          Add
        </button>
      </form>

      {people.length === 0 ? (
        <p className="muted">
          No one added yet. Start with at least two people.
        </p>
      ) : (
        <div className="chips">
          {people.map(person =>
            editingId === person.id ? (
              <div
                className="chip editing-chip"
                key={person.id}
              >
                <input
                  className="chip-edit"
                  value={editingName}
                  onChange={e =>
                    setEditingName(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    saveEdit(
                      person.id
                    )
                  }
                >
                  Save
                </button>

                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    setEditingId(null)
                  }
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span
                className="chip"
                key={person.id}
              >
                {person.name}

                <button
                  type="button"
                  className="chip-action"
                  onClick={() =>
                    startEdit(person)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="chip-action danger"
                  onClick={() =>
                    onDeletePerson(
                      person.id
                    )
                  }
                >
                  ×
                </button>
              </span>
            )
          )}
        </div>
      )}
    </section>
  )
}