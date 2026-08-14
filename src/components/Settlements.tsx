import type { Person } from '../types'
import type { Settlement } from '../utils/settlements'
import { formatMoney } from '../utils/money'

type Props = {
  people: Person[]
  settlements: Settlement[]
}

export function Settlements({
  people,
  settlements,
}: Props) {
  function getPersonName(personId: string) {
    return (
      people.find(person => person.id === personId)
        ?.name ?? 'Unknown'
    )
  }

  return (
    <section>
      <h2>Settle Up</h2>

      {settlements.length === 0 ? (
        <p>Everyone is settled up.</p>
      ) : (
        <ul>
          {settlements.map((settlement, index) => (
            <li
              key={`${settlement.fromPersonId}-${settlement.toPersonId}-${index}`}
            >
              <strong>
                {getPersonName(settlement.fromPersonId)}
              </strong>

              {' pays '}

              <strong>
                {getPersonName(settlement.toPersonId)}
              </strong>

              {' '}

              {formatMoney(settlement.amount)}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}