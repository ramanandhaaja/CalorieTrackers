import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = () => {
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
              <Link href="/features" className="text-white hover:text-gray-200 transition-colors">
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Pricing
              </Link>
              <Link href="/about" className="text-white hover:text-gray-200 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">
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

          {/* Mobile Menu Button (visible on mobile) */}
          <button className="text-white md:hidden">
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
        </div>
      </div>
    </header>
  )
}

export default Header
