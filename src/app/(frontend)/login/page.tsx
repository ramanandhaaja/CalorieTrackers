import React from 'react'
import { Metadata } from 'next'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import LoginForm from '../../../components/layout/LoginForm'

export const metadata: Metadata = {
  title: 'Login | Calorie Trackers',
  description: 'Sign in to your Calorie Trackers account',
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen mt-32">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <LoginForm />
      </main>
      
      <Footer />
    </div>
  )
}
