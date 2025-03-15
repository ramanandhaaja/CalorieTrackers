// Client-side authentication hook
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
  id: string
  email: string
  fullName?: string
  username?: string
  role?: string
  [key: string]: any
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchCurrentUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Determine the base URL for API requests
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      
      // Make a request to the /api/users/me endpoint following Payload's cookie authentication approach
      const response = await fetch(`${baseUrl}/api/users/me`, {
        credentials: 'include', // This is the key part - include credentials (cookies)
        cache: 'no-store'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null)
          return null
        }
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      // In Payload 3, the logout endpoint is /api/users/logout
      await fetch(`${baseUrl}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Manually clear the cookies on the client side
      document.cookie = 'payload-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Clear any other auth-related cookies
      document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      setUser(null)
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login?redirected=true')
      return false
    }
    return true
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return {
    user,
    loading,
    error,
    fetchCurrentUser,
    logout,
    requireAuth,
    isAuthenticated: !!user,
  }
}
