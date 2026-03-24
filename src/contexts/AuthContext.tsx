import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { authApi } from '@/services/api'

type User = {
  userId: number
  fname: string
  minit: string
  lname: string
  email: string
  avatarUrl: string | null
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_USER_KEY = 'authUser'

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {}
}

const AuthContext = createContext<AuthState>(defaultAuthState)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    try {
      const token =
        localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('auth_token')
      const rawUser = localStorage.getItem(STORAGE_USER_KEY)

      if (token && rawUser) {
        setUser(JSON.parse(rawUser) as User)
      }
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem(STORAGE_USER_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await authApi.login({ email, password })

      localStorage.setItem('accessToken', data.token)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
      setUser(data.user)

      navigate('/my-course')
    },
    [navigate]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem(STORAGE_USER_KEY)
    setUser(null)

    const from = location.pathname
    navigate(`/login?from=${encodeURIComponent(from)}`)
  }, [location.pathname, navigate])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!(
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token')
      ),
      isLoading,
      login,
      logout
    }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
