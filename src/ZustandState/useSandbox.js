import { create } from 'zustand'

export const useSandbox = create((set) => ({
    sandbox: false,
    setSandbox: (value) =>
        set((state) => ({ sandbox: value }))
}))