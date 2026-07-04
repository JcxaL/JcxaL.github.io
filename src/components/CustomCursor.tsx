"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Don't render custom cursor for users who prefer reduced motion
      return;
    }

    // Create trail elements
    const trailCount = 8;
    const trailElements: HTMLDivElement[] = [];
    
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `
        position: fixed;
        width: ${12 - i}px;
        height: ${12 - i}px;
        background: var(--folly);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        opacity: ${0.8 - i * 0.1};
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(trail);
      trailElements.push(trail);
    }
    
    trailRef.current = trailElements;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Throttle mouse move for better performance
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= throttleDelay) {
        mousePos.current = { x: e.clientX, y: e.clientY };
        lastTime = now;
      }
    };

    // Mouse enter handler for interactive elements
    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 2,
        backgroundColor: 'var(--neon-cyan)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        scale: 0.5,
        borderColor: 'var(--neon-cyan)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Mouse leave handler for interactive elements
    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'var(--folly)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        scale: 1,
        borderColor: 'var(--folly)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Click handler
    const handleClick = () => {
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: fixed;
        left: ${mousePos.current.x}px;
        top: ${mousePos.current.y}px;
        width: 0;
        height: 0;
        background: radial-gradient(circle, var(--folly) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9996;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(ripple);

      gsap.to(ripple, {
        width: 100,
        height: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
          }
        }
      });

      // Cursor pulse
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    };

    // Animation loop with RAF optimization
    let rafId: number;
    const animate = () => {
      // Smooth cursor movement
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
      
      // Smooth follower movement (slower)
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.08;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.08;

      // Only update if position changed significantly (optimization)
      const deltaX = Math.abs(cursorPos.current.x - mousePos.current.x);
      const deltaY = Math.abs(cursorPos.current.y - mousePos.current.y);
      
      if (deltaX > 0.5 || deltaY > 0.5) {
        // Update cursor position
        cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;

        // Update follower position
        follower.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px) translate(-50%, -50%)`;

        // Update trail positions (reduced trail count for performance)
        trailElements.forEach((trail, index) => {
          const delay = (index + 1) * 0.03;
          const trailX = cursorPos.current.x + (mousePos.current.x - cursorPos.current.x) * delay;
          const trailY = cursorPos.current.y + (mousePos.current.y - cursorPos.current.y) * delay;
          
          trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    animate();

    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });

      // Clean up trail elements
      trailElements.forEach(trail => {
        if (document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          width: '12px',
          height: '12px',
          background: 'var(--folly)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          boxShadow: '0 0 10px var(--folly)',
        }}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
        style={{
          position: 'fixed',
          width: '30px',
          height: '30px',
          border: '2px solid var(--folly)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.6,
        }}
      />
    </>
  );
};

export default CustomCursor; 