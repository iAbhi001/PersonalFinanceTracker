import { create } from "zustand"

export const useTransactionStore = create((set) => ({
  transactions: [],
  addTransaction: (tx) => set((state) => ({ transactions: [...state.transactions, tx] }))
}))
