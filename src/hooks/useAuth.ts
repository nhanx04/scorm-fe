import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('accessToken')
      setIsAuthenticated(!!updatedToken)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return { isAuthenticated }
}

