export function equalSplit(
  totalCents: number,
  personIds: string[]
) {
  if (personIds.length === 0) {
    throw new Error("Select at least one participant");
  }

  const base = Math.floor(totalCents / personIds.length);
  const remainder = totalCents % personIds.length;

  return personIds.map((personId, index) => ({
    personId,
    amount: base + (index < remainder ? 1 : 0),
  }));
}