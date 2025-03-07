import Image from 'next/image'

const AboutUs = () => {
  return (
    <div className="py-20 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-sm uppercase tracking-wider text-gray-500">ABOUT US</h2>
        </div>

        {/* Image 1 - Top Left */}
        <div className="absolute left-0 top-0 hidden md:block">
          <div className="relative h-24 w-24 rounded-lg overflow-hidden">
            <Image
              src="/images/hero-background.jpg"
              alt="User taking photo of food"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Image 2 - Bottom Left */}
        <div className="absolute left-16 bottom-0 hidden md:block">
          <div className="relative h-28 w-28 rounded-lg overflow-hidden">
            <Image
              src="/images/hero-background.jpg"
              alt="Smartphone with calorie tracking app"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Image 3 - Top Right */}
        <div className="absolute right-0 top-0 hidden md:block">
          <div className="relative h-28 w-28 rounded-lg overflow-hidden">
            <Image
              src="/images/hero-background.jpg"
              alt="Dashboard with nutrition data"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Image 4 - Bottom Right */}
        <div className="absolute right-16 bottom-0 hidden md:block">
          <div className="relative h-24 w-24 rounded-lg overflow-hidden">
            <Image
              src="/images/hero-background.jpg"
              alt="Person achieving fitness goals"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Content - Center */}
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-4xl md:text-5xl font-medium text-gray-800 mb-6">
            Our passion for health technology drives us to create{' '}
            <span className="text-green-600">
              tools that not only track calories but transform your relationship with food.
            </span>
          </h3>
          <p className="text-gray-600 mt-6">
            Whether you're starting a fitness journey or maintaining a healthy lifestyle, our AI-powered
            calorie tracking system provides accurate insights and personalized recommendations to help you
            achieve your nutrition goals with confidence and ease.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
