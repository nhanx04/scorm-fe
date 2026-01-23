import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
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

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken')
      const rawUser = localStorage.getItem(STORAGE_USER_KEY)

      if (token && rawUser) {
        setUser(JSON.parse(rawUser) as User)
      }
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem(STORAGE_USER_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password })

    localStorage.setItem('accessToken', data.token)
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
    setUser(data.user)

    navigate('/my-course')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem(STORAGE_USER_KEY)
    setUser(null)

    const from = location.pathname
    navigate(`/login?from=${encodeURIComponent(from)}`)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!localStorage.getItem('accessToken'),
      isLoading,
      login,
      logout
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
