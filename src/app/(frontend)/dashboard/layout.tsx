import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import { SidebarProvider } from '../../../components/layout/SidebarContext'
import Sidebar from '../../../components/layout/Sidebar'

// Create a simple function to check if the user is logged in
async function isUserLoggedIn() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value || ''
  return Boolean(token)
}

// Function to get the user's information from the cookie
async function getUserInfo() {
  try {
    const cookieStore = await cookies()
    const username = cookieStore.get('user-name')?.value
    
    // If username cookie exists, use it (decode it first)
    if (username) {
      return { username: decodeURIComponent(username) }
    }
    
    // Fallback to default if cookie doesn't exist
    return { username: 'User' }
  } catch (error) {
    console.error('Error getting username from cookie:', error)
    return { username: 'User' }
  }
}

// This layout protects all pages in the app directory
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the user is logged in
  const isLoggedIn = await isUserLoggedIn()
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    redirect('/login?redirected=true')
    return null
  }
  
  // Get user info for the sidebar
  const { username } = await getUserInfo()
  
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen bg-gray-50 flex relative">
          {/* Sidebar */}
          <Sidebar username={username} />
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
