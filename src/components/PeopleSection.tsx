import { useState } from 'react'
import type { Person } from '../types'

type Props = {
  people: Person[]
  onAddPerson: (name: string) => void
  onRenamePerson: (
    personId: string,
    newName: string
  ) => void
  onDeletePerson: (personId: string) => void
}

function PeopleSection({
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
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!name.trim()) return

    onAddPerson(name)
    setName('')
  }

  function startEditing(person: Person) {
    setEditingId(person.id)
    setEditingName(person.name)
  }

  function saveEdit(personId: string) {
    if (!editingName.trim()) return

    onRenamePerson(personId, editingName)

    setEditingId(null)
    setEditingName('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <section>
      <h2>People</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={event =>
            setName(event.target.value)
          }
          placeholder="Person name"
        />

        <button type="submit">
          Add Person
        </button>
      </form>

      {people.length === 0 ? (
        <p>No people added yet.</p>
      ) : (
        <ul>
          {people.map(person => (
            <li key={person.id}>
              {editingId === person.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={event =>
                      setEditingName(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      saveEdit(person.id)
                    }
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{person.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(person)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDeletePerson(person.id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PeopleSection