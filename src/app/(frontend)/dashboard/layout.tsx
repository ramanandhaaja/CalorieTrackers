import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

// Create a simple function to check if the user is logged in
async function isUserLoggedIn() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  return Boolean(token)
}

// This layout protects all pages in the app directory
export default async function AppLayout({
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
  
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow w-full">
        {children}
      </main>
      
    </div>
  )
}
