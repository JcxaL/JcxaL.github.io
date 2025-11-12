"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const menuItems = [
  { name: "JcxaL", href: "/", isLogo: true },
  { name: "Travel", href: "/travel", emoji: "✈️" },
  { name: "Photography", href: "/photography", emoji: "📸" },
  { name: "Music", href: "/music", emoji: "🎵" },
  { name: "Design", href: "/design", emoji: "🎨" },
  { name: "Blog", href: "/blog", emoji: "✍️" },
  { name: "Contact", href: "/contact", emoji: "✉️" },
]

export default function LiquidMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const targetItem = hoveredIndex !== null ? itemRefs.current[hoveredIndex] : null
  const navEl = navRef.current

  let targetX = 0
  if (targetItem && navEl) {
    const navRect = navEl.getBoundingClientRect()
    const itemRect = targetItem.getBoundingClientRect()
    // Calculate the center of the item relative to the nav's left edge
    targetX = itemRect.left - navRect.left + itemRect.width / 2
  }

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
        onHoverEnd={() => setHoveredIndex(null)}
      >
        {/* Futuristic glass background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-gray-900/40 to-black/40 backdrop-blur-md rounded-full border border-cyan-400/30 shadow-lg" 
             style={{
               boxShadow: `
                 0 0 20px rgba(0, 255, 255, 0.2),
                 inset 0 0 20px rgba(255, 31, 75, 0.1),
                 0 8px 32px rgba(0, 0, 0, 0.3)
               `
             }} />

        {/* Liquid hover effect with futuristic colors */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              layoutId="liquid-hover"
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  linear-gradient(45deg, 
                    rgba(255, 31, 75, 0.3), 
                    rgba(0, 255, 255, 0.3), 
                    rgba(0, 128, 255, 0.3)
                  )
                `,
                boxShadow: `
                  0 0 30px rgba(0, 255, 255, 0.4),
                  inset 0 0 30px rgba(255, 31, 75, 0.2)
                `
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                background: [
                  "linear-gradient(45deg, rgba(255, 31, 75, 0.3), rgba(0, 255, 255, 0.3), rgba(0, 128, 255, 0.3))",
                  "linear-gradient(90deg, rgba(0, 255, 255, 0.3), rgba(0, 128, 255, 0.3), rgba(255, 31, 75, 0.3))",
                  "linear-gradient(135deg, rgba(0, 128, 255, 0.3), rgba(255, 31, 75, 0.3), rgba(0, 255, 255, 0.3))",
                ],
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 },
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                background: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            />
          )}
        </AnimatePresence>

        {/* Menu items */}
        <ul className="relative flex items-center px-6 py-3 space-x-1">
          {menuItems.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <Link href={item.href}>
                <motion.div
                  className={`relative px-6 py-3 rounded-full transition-all duration-300 ${
                    item.isLogo 
                      ? "font-mono font-bold text-xl text-cyan-400 mr-6 bg-black/20 backdrop-blur-md border border-cyan-400/30 shadow-lg hover:bg-black/30 hover:shadow-xl hover:border-cyan-400/50" 
                      : "text-gray-300 hover:text-cyan-400"
                  }`}
                  whileHover={{
                    scale: item.isLogo ? 1.08 : 1.05,
                    transition: { type: "spring", damping: 15, stiffness: 400 },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { type: "spring", damping: 20, stiffness: 600 },
                  }}
                  style={item.isLogo ? {
                    boxShadow: `
                      0 0 20px rgba(0, 255, 255, 0.3),
                      inset 0 0 20px rgba(255, 31, 75, 0.1)
                    `
                  } : {}}
                >
                  {/* Futuristic glow effect for JcxaL logo */}
                  {item.isLogo && hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 backdrop-blur-lg rounded-full border"
                      style={{
                        background: `
                          linear-gradient(45deg, 
                            rgba(255, 31, 75, 0.4), 
                            rgba(0, 255, 255, 0.4), 
                            rgba(0, 128, 255, 0.4)
                          )
                        `,
                        borderColor: 'rgba(0, 255, 255, 0.6)',
                        boxShadow: `
                          0 0 30px rgba(0, 255, 255, 0.6),
                          inset 0 0 30px rgba(255, 31, 75, 0.3)
                        `
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        background: [
                          "linear-gradient(45deg, rgba(255, 31, 75, 0.4), rgba(0, 255, 255, 0.4), rgba(0, 128, 255, 0.4))",
                          "linear-gradient(90deg, rgba(0, 255, 255, 0.5), rgba(0, 128, 255, 0.4), rgba(255, 31, 75, 0.4))",
                          "linear-gradient(135deg, rgba(0, 128, 255, 0.4), rgba(255, 31, 75, 0.5), rgba(0, 255, 255, 0.4))",
                        ],
                        boxShadow: [
                          "0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(255, 31, 75, 0.3)",
                          "0 0 40px rgba(255, 31, 75, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.3)",
                          "0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(255, 31, 75, 0.3)",
                        ]
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                        background: {
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                        boxShadow: {
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                      }}
                    />
                  )}

                  {/* Individual item liquid effect for non-logo items */}
                  {!item.isLogo && hoveredIndex === index && (
                    <motion.div
                      layoutId={`item-liquid-${index}`}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `
                          linear-gradient(45deg, 
                            rgba(0, 255, 255, 0.3), 
                            rgba(255, 31, 75, 0.3)
                          )
                        `,
                        boxShadow: `
                          0 0 20px rgba(0, 255, 255, 0.4),
                          inset 0 0 20px rgba(255, 31, 75, 0.2)
                        `
                      }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: [0, 5, -5, 0],
                      }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 400,
                        rotate: {
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                      }}
                    />
                  )}

                  {/* Text with futuristic styling */}
                  <motion.span
                    className={`relative z-10 ${
                      item.isLogo 
                        ? "tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-red-400 font-mono uppercase" 
                        : "font-medium"
                    }`}
                    style={item.isLogo ? {
                      textShadow: `
                        0 0 10px rgba(0, 255, 255, 0.8),
                        0 0 20px rgba(0, 255, 255, 0.4),
                        0 0 30px rgba(0, 255, 255, 0.2)
                      `
                    } : {}}
                    animate={
                      hoveredIndex === index
                        ? {
                            y: [0, -2, 0],
                            transition: {
                              duration: 0.6,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            },
                          }
                        : {}
                    }
                  >
                    {item.name}
                  </motion.span>

                  {/* Futuristic droplet effect for non-logo items */}
                  {!item.isLogo && hoveredIndex === index && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-2 h-2 rounded-full"
                      style={{
                        background: `
                          linear-gradient(45deg, 
                            rgba(0, 255, 255, 0.8), 
                            rgba(255, 31, 75, 0.8)
                          )
                        `,
                        boxShadow: `
                          0 0 10px rgba(0, 255, 255, 0.6),
                          0 0 20px rgba(0, 255, 255, 0.3)
                        `
                      }}
                      initial={{ 
                        opacity: 0, 
                        scale: 0, 
                        x: "-50%",
                        y: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        y: [0, 8, 16],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  {/* Tech particle effects */}
                  {hoveredIndex === index && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            background: i % 2 === 0 ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 31, 75, 0.8)',
                            boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(0, 255, 255, 0.6)' : 'rgba(255, 31, 75, 0.6)'}`,
                            top: `${20 + i * 20}%`,
                            left: `${20 + i * 30}%`,
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, Math.random() * 20 - 10],
                            y: [0, Math.random() * 20 - 10],
                          }}
                          transition={{
                            duration: 1 + Math.random(),
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Flying Emoji Animation */}
        <AnimatePresence>
          {hoveredIndex !== null && menuItems[hoveredIndex].emoji && (
            <motion.div
              key={hoveredIndex}
              className="absolute text-3xl z-20 pointer-events-none"
              style={{ transform: "translateX(-50%)" }}
              initial={{ x: 20, y: 50, opacity: 0, scale: 0.5 }}
              animate={{
                x: targetX,
                y: -20,
                opacity: 1,
                scale: 1,
                rotate: [0, 10, -10, 0],
                transition: { 
                  type: "spring", 
                  damping: 18, 
                  stiffness: 250,
                  rotate: {
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }
                },
              }}
              exit={{
                x: navEl ? navEl.offsetWidth - 20 : 500,
                y: -25,
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.4, ease: "easeIn" },
              }}
            >
              {menuItems[hoveredIndex].emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.nav>
    </div>
  )
} 