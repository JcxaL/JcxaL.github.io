"use client";

import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Matrix characters - mix of tech symbols and numbers
    const matrixChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to store the y position of each column
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Color gradients for the rain
    const colors = [
      'rgba(0, 255, 65, 0.8)',   // Matrix green
      'rgba(0, 255, 255, 0.6)',  // Neon cyan
      'rgba(255, 31, 75, 0.4)',  // Folly red
      'rgba(0, 128, 255, 0.5)',  // Electric blue
    ];

    const draw = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(14, 19, 31, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      // Draw each column
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i]);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Reset drop position if it goes off screen
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i] += fontSize * (0.5 + Math.random() * 0.5);
      }
    };

    // Animation loop
    const animate = () => {
      draw();
      setTimeout(() => requestAnimationFrame(animate), 50);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
      // Recalculate columns
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = newColumns;
      for (let i = 0; i < newColumns; i++) {
        if (drops[i] === undefined) {
          drops[i] = Math.random() * canvas.height;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -10,
        opacity: 0.3,
      }}
    />
  );
};

export default MatrixRain; 