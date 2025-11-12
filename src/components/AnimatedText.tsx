"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  animation?: 'typewriter' | 'glitch' | 'fadeIn' | 'slideUp' | 'matrix';
  delay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

const AnimatedText = ({
  text,
  animation = 'typewriter',
  delay = 0,
  duration = 2000,
  className = '',
  onComplete
}: AnimatedTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalText = useRef(text);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const startAnimation = () => {
      switch (animation) {
        case 'typewriter':
          typewriterAnimation();
          break;
        case 'glitch':
          glitchAnimation();
          break;
        case 'fadeIn':
          fadeInAnimation();
          break;
        case 'slideUp':
          slideUpAnimation();
          break;
        case 'matrix':
          matrixAnimation();
          break;
        default:
          typewriterAnimation();
      }
    };

    const typewriterAnimation = () => {
      element.textContent = '';
      element.style.borderRight = '3px solid var(--folly)';
      
      let i = 0;
      const timer = setInterval(() => {
        if (i < originalText.current.length) {
          element.textContent += originalText.current.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          // Remove cursor after animation
          setTimeout(() => {
            element.style.borderRight = 'none';
            if (onComplete) onComplete();
          }, 500);
        }
      }, duration / originalText.current.length);
    };

    const glitchAnimation = () => {
      element.textContent = originalText.current;
      element.setAttribute('data-text', originalText.current);
      element.style.position = 'relative';
      
      // Add glitch class
      element.classList.add('glitch');
      
      setTimeout(() => {
        element.classList.remove('glitch');
        if (onComplete) onComplete();
      }, duration);
    };

    const fadeInAnimation = () => {
      element.textContent = originalText.current;
      gsap.fromTo(element, 
        { 
          opacity: 0,
          y: 20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duration / 1000,
          ease: 'power2.out',
          onComplete: onComplete
        }
      );
    };

    const slideUpAnimation = () => {
      element.textContent = originalText.current;
      gsap.fromTo(element,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: duration / 1000,
          ease: 'power3.out',
          onComplete: onComplete
        }
      );
    };

    const matrixAnimation = () => {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      const finalText = originalText.current;
      let currentText = '';
      
      // Fill with random characters initially
      for (let i = 0; i < finalText.length; i++) {
        currentText += chars[Math.floor(Math.random() * chars.length)];
      }
      
      element.textContent = currentText;
      
      // Animate each character to its final form using GSAP
      gsap.to({}, {
        duration: duration / 1000,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress();
          let newText = '';
          for (let i = 0; i < finalText.length; i++) {
            if (progress > (i / finalText.length)) {
              newText += finalText[i];
            } else {
              newText += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          element.textContent = newText;
        },
        onComplete: () => {
          element.textContent = finalText;
          if (onComplete) onComplete();
        }
      });
    };

    // Start animation after delay
    setTimeout(startAnimation, delay);
  }, [text, animation, delay, duration, onComplete]);

  return (
    <span 
      ref={textRef}
      className={`animated-text ${className}`}
      style={{
        display: 'inline-block',
        fontFamily: 'monospace',
      }}
    />
  );
};

// Component for animating multiple lines with stagger effect
interface AnimatedTextLinesProps {
  lines: string[];
  animation?: 'typewriter' | 'glitch' | 'fadeIn' | 'slideUp' | 'matrix';
  staggerDelay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedTextLines = ({
  lines,
  animation = 'fadeIn',
  staggerDelay = 200,
  duration = 1000,
  className = '',
  onComplete
}: AnimatedTextLinesProps) => {
  const completedLines = useRef(0);

  const handleLineComplete = () => {
    completedLines.current++;
    if (completedLines.current === lines.length && onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`animated-text-lines ${className}`}>
      {lines.map((line, index) => (
        <div key={index} style={{ marginBottom: '0.5rem' }}>
          <AnimatedText
            text={line}
            animation={animation}
            delay={index * staggerDelay}
            duration={duration}
            onComplete={handleLineComplete}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedText; 