import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import LoginForm from '../../../components/layout/LoginForm'

export const metadata: Metadata = {
  title: 'Login | Calorie Trackers',
  description: 'Sign in to your Calorie Trackers account',
}

// Loading fallback component
function LoginFormSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
      <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen mt-32">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}
