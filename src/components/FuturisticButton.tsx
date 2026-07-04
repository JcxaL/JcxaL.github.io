"use client";

import { useEffect, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';

interface FuturisticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  href?: string;
}

const FuturisticButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  href
}: FuturisticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;
    const scanline = scanlineRef.current;
    const particles = particlesRef.current;

    if (!button || !glow || !scanline) return;

    // Create particles for click effect
    const createParticles = () => {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'button-particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--folly);
          border-radius: 50%;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `;
        button.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    createParticles();

    // Hover animation
    const handleMouseEnter = () => {
      if (disabled) return;
      
      gsap.to(glow, {
        opacity: 1,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(scanline, {
        x: '100%',
        duration: 0.8,
        ease: 'power2.inOut'
      });

      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (disabled) return;
      
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(scanline, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Click animation
    const handleClick = (e: Event) => {
      if (disabled) return;
      
      e.preventDefault();
      
      // Button pulse
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });

      // Particle explosion
      particlesRef.current.forEach((particle, index) => {
        const angle = (index * 45) * Math.PI / 180;
        const distance = 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        gsap.fromTo(particle, 
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          },
          {
            x,
            y,
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'power2.out'
          }
        );
      });

      // Execute click handler after animation
      setTimeout(() => {
        if (onClick) onClick();
        if (href) window.location.href = href;
      }, 100);
    };

    // Event listeners
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    // Initial setup
    gsap.set(glow, { opacity: 0.6 });
    gsap.set(scanline, { x: '-100%' });

    // Cleanup
    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
      
      particles.forEach(particle => {
        if (button.contains(particle)) {
          button.removeChild(particle);
        }
      });
    };
  }, [onClick, href, disabled]);

  const variantStyles = {
    primary: {
      background: 'linear-gradient(45deg, var(--folly), var(--electric-blue))',
      border: '1px solid var(--folly)',
      color: 'white',
      glowColor: 'var(--folly)'
    },
    secondary: {
      background: 'linear-gradient(45deg, var(--delft-blue), var(--english-violet))',
      border: '1px solid var(--delft-blue)',
      color: 'var(--cadet-gray)',
      glowColor: 'var(--delft-blue)'
    },
    accent: {
      background: 'linear-gradient(45deg, var(--neon-cyan), var(--electric-blue))',
      border: '1px solid var(--neon-cyan)',
      color: 'var(--rich-black)',
      glowColor: 'var(--neon-cyan)'
    }
  };

  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: '36px'
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
      minHeight: '44px'
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px',
      minHeight: '52px'
    }
  };

  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  const buttonProps = {
    ref: buttonRef,
    className: `futuristic-button ${className}`,
    disabled,
    style: {
      position: 'relative' as const,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: styles.background,
      border: styles.border,
      color: styles.color,
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
      overflow: 'hidden' as const,
      opacity: disabled ? 0.5 : 1,
      ...sizes,
    }
  };

  const ButtonContent = () => (
    <>
      {/* Glow effect */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: styles.glowColor,
          borderRadius: '8px',
          opacity: 0.6,
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />
      
      {/* Scan line effect */}
      <div
        ref={scanlineRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transform: 'translateX(-100%)',
          zIndex: 1,
        }}
      />
      
      {/* Content */}
      <span style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        ref={buttonRef as RefObject<HTMLAnchorElement | null>}
        className={buttonProps.className}
        style={buttonProps.style}
        href={href}
      >
        <ButtonContent />
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as RefObject<HTMLButtonElement | null>}
      className={buttonProps.className}
      disabled={disabled}
      style={buttonProps.style}
    >
      <ButtonContent />
    </button>
  );
};

export default FuturisticButton; 