export default function HowItWorks() {
  return (
    <div className="bg-gray-50 py-16" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Track your calories in three simple steps
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our intuitive process makes calorie tracking quick and accurate, so you can focus on your health goals.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white mb-4">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Take a photo or search</h3>
              <p className="mt-2 text-base text-gray-500">
                Snap a picture of your meal with your smartphone or search our extensive food database.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white mb-4">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm the details</h3>
              <p className="mt-2 text-base text-gray-500">
                Our AI identifies the food and suggests portion sizes. You can adjust if needed for perfect accuracy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white mb-4">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Track and analyze</h3>
              <p className="mt-2 text-base text-gray-500">
                View your daily intake, track progress toward goals, and gain insights into your nutrition patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}