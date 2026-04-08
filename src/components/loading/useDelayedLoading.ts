import { useEffect, useState } from 'react'

export function useDelayedLoading(isLoading: boolean, delayMs = 200) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }

    const timer = window.setTimeout(() => setShowLoading(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [isLoading, delayMs])

  return showLoading
}

