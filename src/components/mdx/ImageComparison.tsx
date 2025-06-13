"use client"

import { useState } from 'react'

interface ImageComparisonProps {
  before: React.ReactNode
  after: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
}

export default function ImageComparison({ 
  before, 
  after, 
  beforeLabel = "Before", 
  afterLabel = "After" 
}: ImageComparisonProps) {
  const [dividerPosition, setDividerPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setDividerPosition(Math.min(Math.max(percentage, 0), 100))
  }

  return (
    <div className="my-8">
      <div
        className="relative overflow-hidden rounded-lg cursor-col-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* After image (full width) */}
        <div className="w-full">
          {after}
        </div>
        
        {/* Before image (clipped) */}
        <div 
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${dividerPosition}%` }}
        >
          {before}
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
          style={{ left: `${dividerPosition}%` }}
          onMouseDown={handleMouseDown}
        >
          {/* Divider handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 border-l-2 border-r-2 border-gray-400"></div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {afterLabel}
        </div>
      </div>
      
      {/* Instructions */}
      <p className="text-center text-sm text-gray-500 mt-2">
        Drag the slider to compare
      </p>
    </div>
  )
} 