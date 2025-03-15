'use client';

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading } = useAuth()
  
  // User is logged in if user object exists
  const isLoggedIn = !!user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-6 px-8 md:px-16 lg:px-24 bg-gray-400/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-white text-2xl font-semibold">
            CalorieTracker<sup className="text-xs">AI</sup>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {/* Temporarily point to homepage to avoid 404s */}
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                Features
              </Link>
              <Link
                href="/"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Pricing
              </Link>
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                About Us
              </Link>
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {loading ? (
                // Show loading state
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
              ) : isLoggedIn ? (
                <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                  <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Link
                      href="/"
                      className="text-gray-800 hover:text-green-600 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="/"
                      className="text-gray-800 hover:text-green-600 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/"
                      className="text-gray-800 hover:text-green-600 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/"
                      className="text-gray-800 hover:text-green-600 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                  <div className="grid gap-3 mt-6">
                    {loading ? (
                      // Show loading state
                      <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
                    ) : isLoggedIn ? (
                      <Button 
                        asChild 
                        className="bg-green-600 text-white hover:bg-green-700 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/dashboard">Go to Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Link 
                          href="/login" 
                          className="text-gray-800 hover:text-green-600 transition-colors text-lg font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          Login
                        </Link>
                        <Button 
                          asChild 
                          className="bg-green-600 text-white hover:bg-green-700 w-full mt-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/register">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
