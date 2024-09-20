import { create } from 'zustand'

export const useUser = create((set) => ({
  user: {
    emailId:'',
    apiKey:''
  },
  balance:0,
  transactions:0,
  setUser: (value) =>
  set((state) => ({ user: value })),
  setBalance: (value) =>
  set((state) => ({ balance: value })),
  setTransactions: (value) =>
  set((state) => ({ transactions: value })),
}))