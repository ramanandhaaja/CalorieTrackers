import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Define types for feature item
interface FeatureItemProps {
  id?: number
  title: string
  description: string
  image: string
  category: string
}

const FeatureItem = ({ title, description, image, category }: FeatureItemProps) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <div className="inline-block px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full mb-3">
          {category}
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

const Menu = () => {
  // App features
  const features: FeatureItemProps[] = [
    {
      id: 1,
      title: 'Photo Recognition',
      description: 'Snap a photo of your meal and our AI instantly identifies food items and calculates calories.',
      image: '/images/hero-background.jpg',
      category: 'AI Powered',
    },
    {
      id: 2,
      title: 'Nutrition Dashboard',
      description: 'Track your daily intake with a comprehensive dashboard showing macros, nutrients, and goals.',
      image: '/images/hero-background.jpg',
      category: 'Analytics',
    },
    {
      id: 3,
      title: 'Meal Planning',
      description: 'Get personalized meal suggestions based on your dietary preferences and nutrition goals.',
      image: '/images/hero-background.jpg',
      category: 'Personalization',
    },
    {
      id: 4,
      title: 'Progress Tracking',
      description: 'View your nutrition trends over time with detailed charts and insights on your habits.',
      image: '/images/hero-background.jpg',
      category: 'Analytics',
    },
  ]

  // Categories for filter
  const categories = ['All', 'AI Powered', 'Analytics', 'Personalization', 'Integration']

  return (
    <div className="py-20 px-8 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-5xl font-medium text-gray-800 mb-6 md:mb-0">Features</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-sm ${
                  category === 'All'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View All Features Button */}
          <Button asChild className="hidden md:block bg-green-600 text-white hover:bg-green-700 ml-4">
            <Link href="/features">View all features</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => (
            <FeatureItem
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>

        {/* Mobile View All Features Button */}
        <div className="mt-12 flex justify-center md:hidden">
          <Button asChild className="bg-green-600 text-white hover:bg-green-700">
            <Link href="/features">View all features</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Menu
