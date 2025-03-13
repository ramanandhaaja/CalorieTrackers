import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ContactInfo = () => {
  return (
    <div className="py-20 px-8 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium text-gray-800">
                Get in touch<br /><span className="text-green-600">with our team</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Have questions about our calorie tracking app? Our support team is here to help you get started
                and make the most of your health journey.
              </p>
              <p className="text-lg text-gray-700">
                Whether you need technical assistance, have billing questions, or want to learn more about our
                enterprise solutions, we're just a message away.
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-lg text-gray-700">
                Support Hours:
              </p>
              <p className="text-lg text-gray-700">
                Monday - Friday: 8:00 AM - 8:00 PM EST
              </p>
              <p className="text-lg text-gray-700">
                Saturday - Sunday: 9:00 AM - 5:00 PM EST
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8">
              <a 
                href="mailto:support@calorietracker.ai" 
                className="text-green-600 border-b border-green-600 pb-1 hover:text-green-700"
              >
                support@calorietracker.ai
              </a>
              <a 
                href="tel:+15551234567" 
                className="text-green-600 border-b border-green-600 pb-1 hover:text-green-700"
              >
                Phone: (555) 123-4567
              </a>
            </div>

            <Button asChild className="bg-green-600 text-white hover:bg-green-700 mt-4 w-fit">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          
          {/* Right Column - Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-[500px] w-full">
              <Image 
                src="/images/team.jpg" 
                alt="Support team helping customers with the calorie tracking app" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
