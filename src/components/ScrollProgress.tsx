"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrollProgress = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBar = progressBarRef.current;
    const container = containerRef.current;
    
    if (!progressBar || !container) return;

    // Initialize progress bar
    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left' });

    let lastScrollY = 0;
    
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      // Animate progress bar
      gsap.to(progressBar, {
        scaleX: scrollPercent,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Change color based on progress
      const hue = scrollPercent * 180; // From red to cyan
      progressBar.style.background = `linear-gradient(90deg, 
        hsl(${348 + hue}, 100%, 56%), 
        hsl(${180 + hue}, 100%, 50%)
      )`;

      // Add glow effect based on scroll speed
      const scrollSpeed = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      
      if (scrollSpeed > 5) {
        progressBar.style.boxShadow = `
          0 0 20px hsl(${348 + hue}, 100%, 56%),
          0 0 40px hsl(${348 + hue}, 100%, 56%),
          0 0 60px hsl(${348 + hue}, 100%, 56%)
        `;
      } else {
        progressBar.style.boxShadow = `0 0 10px hsl(${348 + hue}, 100%, 56%)`;
      }
    };

    // Scroll event listener
    window.addEventListener('scroll', updateProgress);
    
    // Initial call
    updateProgress();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-progress-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'rgba(14, 19, 31, 0.8)',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        ref={progressBarRef}
        className="scroll-progress-bar"
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, var(--folly), var(--neon-cyan))',
          transformOrigin: 'left',
          transition: 'box-shadow 0.3s ease',
        }}
      />
      
      {/* Animated dots at the end */}
      <div
        className="progress-dots"
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '4px',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="progress-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--folly)',
              animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollProgress; 