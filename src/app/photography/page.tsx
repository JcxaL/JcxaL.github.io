export default function Photography() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photography</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Capturing moments, emotions, and stories through the art of photography.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio</h2>
            <p className="text-gray-600">
              A curated collection of my best work across various genres and styles.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Techniques</h2>
            <p className="text-gray-600">
              Insights into my photographic process and the techniques I use to create compelling images.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 