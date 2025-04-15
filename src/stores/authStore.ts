import {create} from 'zustand'
import {jwtDecode} from 'jwt-decode'
import { getAuth } from '@/generated/api/endpoints/auth/auth'
import { persist } from 'zustand/middleware'

interface JwtPayload {
    sub: string
    exp: number
    iat: number 
    [key: string]: any
}

export interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    user: JwtPayload | null
    isRefreshing: boolean
    isTokenExpired: () => boolean
    isTokenExpiringSoon: () => boolean

    setTokens: (tokens: {accessToken: string; refreshToken: string}) => void
    clearTokens: () => void
    initAuth: () => void
    refreshAccessToken: () => Promise<boolean>
    getTokens: () => AuthState
}
export const useAuthStore = create<AuthState>()( 
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isRefreshing: false,

      setTokens: ({ accessToken, refreshToken }) => {
        const user = jwtDecode<JwtPayload>(accessToken)
        set({ accessToken, refreshToken, user })
      },
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, user: null })
      },
      initAuth: () => {
        // không cần thiết nữa nếu dùng persist
      },
      refreshAccessToken: async () => {
        if (get().isRefreshing) return false
        const refreshToken = get().refreshToken
        if (!refreshToken) return false

        try {
          set({ isRefreshing: true })
          const auth = getAuth()
          const response = await auth.authControllerRefreshAcessToken()
          const data = response.data
          const newAccessToken = data.accessToken
          const decoded = jwtDecode<JwtPayload>(newAccessToken)
          set({
            accessToken: newAccessToken,
            user: decoded,
            isRefreshing: false,
          })
          return true
        } catch (err) {
          console.error('Refresh token error:', err)
          set({ isRefreshing: false })
          get().clearTokens()
          return false
        }
      },
      isTokenExpired: () => {
        const { user } = get()
        if (!user?.exp) return true
        return Date.now() >= user.exp * 1000
      },
      isTokenExpiringSoon: () => {
        const { user } = get()
        if (!user?.exp) return true
        return Date.now() >= user.exp * 1000 - 5 * 60 * 1000
      },
      getTokens: () => get(),
    }),
    {
      name: 'auth-storage', // key trong localStorage
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)
