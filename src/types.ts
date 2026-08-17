export type SplitMode = "equal" | "exact";
export type Person = { id: string; name: string };
export type Expense = {
  id: string;
  description: string;
  amountCents: number;
  paidBy: string;
  participants: string[];
  mode: SplitMode;
  exact: Record<string, number>; // personId -> cents (mode === "exact")
  createdAt: number;
};
export type Settlement = { from: string; to: string; amountCents: number };
