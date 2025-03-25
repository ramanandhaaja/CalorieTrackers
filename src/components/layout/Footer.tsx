import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="py-16 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Product Links - Left Side */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Resources Links - Middle */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links - Middle */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action - Right Side */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="text-2xl font-semibold text-gray-800 mb-2">
                FitCount<sup className="text-xs">AI</sup>
              </div>
              <p className="text-gray-600 mb-6">
                Track your nutrition with AI precision. Take photos of your food or enter details manually to monitor
                your calorie intake and achieve your health goals.
              </p>
              <Link
                href="/register"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Start tracking free
              </Link>
            </div>

            <div className="mt-8 md:mt-0">
              <Link href="#top" className="text-gray-600 hover:text-gray-900">
                Back to top
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright - Bottom */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} CalorieTracker AI. All Rights Reserved.</p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              Made with ❤️ for your health journey
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
