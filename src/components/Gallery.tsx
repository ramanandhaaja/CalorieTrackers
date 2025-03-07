import Image from 'next/image'

const Gallery = () => {
  return (
    <div className="py-20 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-medium text-gray-800">
            App <span className="text-green-600">Interface</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            See how our intuitive design makes calorie tracking simple and effective
          </p>
        </div>

        {/* Gallery Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              aria-label="Previous gallery image"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              aria-label="Next gallery image"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image 1 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-80 w-full">
              <Image 
                src="/images/hero-background.jpg" 
                alt="Mobile app dashboard showing daily calorie tracking" 
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-4">
              <h3 className="font-medium text-gray-800">Intuitive Dashboard</h3>
              <p className="text-gray-600 text-sm">Track your daily calories and nutrition at a glance</p>
            </div>
          </div>
          
          {/* Image 2 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-80 w-full">
              <Image 
                src="/images/hero-background.jpg" 
                alt="Food photo recognition in action" 
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-4">
              <h3 className="font-medium text-gray-800">AI Photo Recognition</h3>
              <p className="text-gray-600 text-sm">Simply take a photo and our AI identifies your food</p>
            </div>
          </div>
          
          {/* Image 3 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-80 w-full">
              <Image 
                src="/images/hero-background.jpg" 
                alt="Nutrition analytics and progress charts" 
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-4">
              <h3 className="font-medium text-gray-800">Progress Analytics</h3>
              <p className="text-gray-600 text-sm">Detailed insights and trends to track your nutrition journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery
