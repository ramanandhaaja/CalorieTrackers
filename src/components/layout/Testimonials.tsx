import Image from 'next/image'

// Testimonial data
const testimonials = [
  {
    id: 1,
    quote:
      'The AI photo recognition is incredibly accurate! I just snap a picture of my meal and it identifies everything with precise calorie counts.',
    author: 'John L.',
    image: '/images/hero-background.jpg',
    alt: 'Satisfied user John',
  },
  {
    id: 2,
    quote:
      "I've lost 15 pounds in 3 months by consistently tracking my calories with this app. The dashboard makes it so easy to stay on track.",
    author: 'Sarah M.',
    image: '/images/hero-background.jpg',
    alt: 'Satisfied user Sarah',
  },
  {
    id: 3,
    quote:
      "As a fitness coach, I recommend this app to all my clients. The detailed nutrition breakdown and AI analysis are game-changers for accountability.",
    author: 'Michael R.',
    image: '/images/hero-background.jpg',
    alt: 'Satisfied user Michael',
  },
  {
    id: 4,
    quote:
      "The meal suggestions based on my dietary preferences have introduced me to so many healthy options I wouldn't have tried otherwise. Love this app!",
    author: 'Elena K.',
    image: '/images/hero-background.jpg',
    alt: 'Satisfied user Elena',
  },
]

const Testimonials = () => {
  return (
    <div className="py-20 px-8 md:px-16 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            WHAT OUR CLIENTS SAY
          </h2>
        </div>

        {/* First Testimonial (Visible) */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Content - Left */}
            <div className="lg:col-span-6">
              <blockquote className="text-2xl font-light italic mb-6">"{testimonials[0].quote}"</blockquote>
              <div className="flex items-center">
                <p className="text-gray-600">—{testimonials[0].author}</p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-amber-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500">5.0/123 reviews</span>
              </div>
            </div>
            
            {/* Image - Right */}
            <div className="lg:col-span-6 rounded-lg overflow-hidden">
              <div className="relative h-96 w-full">
                <Image
                  src={testimonials[0].image}
                  alt={testimonials[0].alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(1).map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 inline-block text-amber-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-600 mb-4">"{testimonial.quote}"</blockquote>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.alt}
                    fill
                    className="object-cover"
                  /> 
                </div>
                <p className="font-medium">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
