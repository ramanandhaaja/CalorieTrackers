import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    description: 'Perfect for getting started with calorie tracking',
    features: [
      'Basic food photo recognition',
      'Manual food entry',
      'Daily calorie summary',
      'Limited food database access',
      '7-day history',
    ],
    cta: 'Start for free',
    mostPopular: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    frequency: '/month',
    description: 'Everything you need for serious nutrition tracking',
    features: [
      'Advanced food recognition AI',
      'Unlimited history',
      'Detailed nutritional insights',
      'Custom meal plans',
      'Progress reports and analytics',
      'Full food database access',
      'Goal setting and tracking',
    ],
    cta: 'Start free trial',
    mostPopular: true,
  },
  {
    name: 'Family',
    price: '$19.99',
    frequency: '/month',
    description: 'Track nutrition for the whole family',
    features: [
      'All Premium features',
      'Up to 5 user profiles',
      'Family meal planning',
      'Shared grocery lists',
      'Family nutrition insights',
      'Personalized recommendations',
      'Priority support',
    ],
    cta: 'Start free trial',
    mostPopular: false,
  },
];

export default function Pricing() {
  return (
    <div className="bg-gray-50 py-16" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Plans for every lifestyle
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className={`bg-white rounded-lg shadow-md divide-y divide-gray-200 ${tier.mostPopular ? 'ring-2 ring-emerald-500' : ''}`}>
              <div className="p-6">
                {tier.mostPopular && (
                  <p className="absolute top-0 transform -translate-y-1/2 bg-emerald-500 rounded-full px-4 py-1 text-sm font-semibold text-white">
                    Most popular
                  </p>
                )}
                <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                  <span className="text-base font-medium text-gray-500">{tier.frequency}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                <Link href="/signup" className={`mt-8 block w-full bg-${tier.mostPopular ? 'emerald-600 hover:bg-emerald-700' : 'gray-800 hover:bg-gray-900'} rounded-md py-2 text-sm font-semibold text-white text-center`}>
                  {tier.cta}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}