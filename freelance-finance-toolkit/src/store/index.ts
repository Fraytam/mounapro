import { create } from "zustand"
import type { UserProfile } from "@/types"

interface AppState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}))
