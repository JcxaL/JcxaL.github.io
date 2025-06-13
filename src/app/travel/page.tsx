export default function Travel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the world through my lens. Adventures, cultures, and experiences from around the globe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Adventures</h2>
            <p className="text-gray-600">
              Coming soon: Stories and photos from my latest travels around the world.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Destinations</h2>
            <p className="text-gray-600">
              A collection of places I&apos;ve been and recommendations for fellow travelers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}