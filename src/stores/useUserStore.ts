// stores/useUserStore.ts
import { create } from 'zustand'

type UserState = {
  user: any
  setUser: (user: any) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
