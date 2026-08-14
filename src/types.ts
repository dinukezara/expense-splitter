export type Person = {
  id: string
  name: string
}

export type Split = {
  personId: string
  amount: number
}

export type SplitType = 'equal' | 'exact'

export type Expense = {
  id: string
  description: string
  amount: number
  paidBy: string
  splitType: SplitType
  splits: Split[]
}