import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, Role } from '@/shared/api/types'

interface AuthState {
  user: Omit<AuthResponse, 'accessToken'> | null
  isAuthenticated: boolean
  login: (res: AuthResponse) => void
  logout: () => void
  hasRole: (roles: Role[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, gets) => ({
      user: null,
      isAuthenticated: false,
      login: ({ accessToken, ...user }) => {
        localStorage.setItem('accessToken', accessToken)
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, isAuthenticated: false })
      },
      hasRole: (roles) => {
        const role = gets().user?.role
        return !!role && roles.includes(role)
      },
    }),
    { name: 'herstory-auth' },
  ),
)
