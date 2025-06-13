"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageGalleryProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  gap?: 2 | 4 | 6 | 8
}

export default function ImageGallery({ 
  children, 
  columns = 3, 
  gap = 4 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <>
      <div className={`grid ${gridCols[columns]} ${gapClasses[gap]} my-8`}>
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(index)}
          >
            {child}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {childrenArray[selectedImage]}
              <button
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 