export default function Music() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Music</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exploring the rhythm of life through melodies, compositions, and musical experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Compositions</h2>
            <p className="text-gray-600">
              Original pieces and musical experiments across various genres and styles.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Playlists</h2>
            <p className="text-gray-600">
              Curated collections of music that inspire and accompany different moods and moments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 