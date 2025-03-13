import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-background.jpg"
          alt="Healthy meal with smartphone tracking app"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-8">
            Track calories<br />
            with AI precision.
          </h1>

          {/* Subheading */}
          <p className="text-2xl md:text-3xl text-white mb-12 max-w-2xl">
            Snap a photo or enter your food details. Our AI-powered app tracks your calories and helps you reach your health goals.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              asChild
              className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-md text-xl w-fit"
            >
              <Link href="/register">Start tracking free</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-white hover:text-gray-200 px-10 py-4 rounded-md text-xl underline w-fit"
            >
              <Link href="/">Explore features</Link>
            </Button>
          </div>
        </div>

        {/* Feature Badge - Bottom Right */}
        <div className="absolute bottom-10 right-10 text-right text-white bg-green-600/70 p-3 rounded-lg">
          <p className="text-xl font-semibold">Powered by AI</p>
          <p className="text-md">Smart calorie tracking</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
