export default function Design() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating beautiful and functional experiences through thoughtful design and visual storytelling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">UI/UX Projects</h2>
            <p className="text-gray-600">
              Digital interfaces and user experiences that prioritize usability and aesthetic appeal.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visual Identity</h2>
            <p className="text-gray-600">
              Brand design, logos, and visual systems that communicate effectively and memorably.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 