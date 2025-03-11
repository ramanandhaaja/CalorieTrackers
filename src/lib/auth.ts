import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type User = {
  id: string
  email: string
  fullName?: string
  username?: string
  role?: string
  [key: string]: any
}

/**
 * Server-side function to get the current authenticated user
 * This should only be used in Server Components
 */
export async function getCurrentUser() {
  try {
    // Check if we have a token in cookies (just for redirection logic)
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    
    // If no token is found, return null
    if (!token) {
      return null
    }
    
    // Determine the base URL for API requests
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    
    // Make a request to the /api/users/me endpoint
    const response = await fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Cookie: `payload-token=${token}`
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Server-side function to require authentication
 * Redirects to login if user is not authenticated
 * This should only be used in Server Components
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login?redirected=true')
  }
  
  return user
}
