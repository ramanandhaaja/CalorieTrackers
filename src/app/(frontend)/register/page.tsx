import React from 'react'
import { Metadata } from 'next'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import RegisterForm from '../../../components/layout/RegisterForm'

export const metadata: Metadata = {
  title: 'Register | Calorie Trackers',
  description: 'Create a new account on Calorie Trackers',
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen mt-32">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <RegisterForm />
      </main>
      
      <Footer />
    </div>
  )
}
