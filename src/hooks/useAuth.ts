import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token =
      localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)

    const handleStorageChange = () => {
      const updatedToken =
        localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('auth_token')
      setIsAuthenticated(!!updatedToken)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return { isAuthenticated }
}
