export type Person = {
  id: string
  name: string
}

export type SplitType =
  | 'equal'
  | 'exact'

export type ExpenseSplit = {
  personId: string
  amount: number
}

export type Expense = {
  id: string
  description: string
  amount: number
  paidBy: string
  splitType: SplitType
  splits: ExpenseSplit[]
}