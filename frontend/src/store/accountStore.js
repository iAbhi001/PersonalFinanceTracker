import { create } from "zustand"

export const useAccountStore = create((set) => ({
  accounts: [],
  addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] }))
}))
