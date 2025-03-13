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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

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

            {/* Login/Register Buttons */}
            <div className="flex items-center space-x-4 ml-4">
              <Link href="/login" className="text-white hover:text-gray-200 transition-colors">
                Login
              </Link>
              <Button asChild className="bg-green-600 text-white hover:bg-green-700">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu (visible on mobile) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-white md:hidden" aria-label="Open menu">
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
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[80%] sm:w-[350px] bg-white border-gray-200 p-0 shadow-lg"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <SheetClose className="rounded-full p-2 hover:bg-gray-100" aria-label="Close menu">
                    <X className="h-5 w-5 text-gray-500" />
                  </SheetClose>
                </div>
                
                {/* Menu content */}
                <div className="flex flex-col p-6">
                  <nav className="flex flex-col space-y-6 mb-8" aria-label="Main navigation">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Menu
                    </h3>
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
                  </nav>
                  
                  {/* Login/Register Buttons */}
                  <div className="flex flex-col space-y-4 mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Account
                    </h3>
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
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
