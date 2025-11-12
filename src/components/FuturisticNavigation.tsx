"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FuturisticNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLNavElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'HOME', icon: '🏠' },
    { href: '/about', label: 'ABOUT', icon: '👤' },
    { href: '/projects', label: 'PROJECTS', icon: '⚡' },
    { href: '/blog', label: 'BLOG', icon: '📝' },
    { href: '/contact', label: 'CONTACT', icon: '📡' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Animate menu items in
      const menuItems = menuRef.current?.querySelectorAll('.menu-item');
      if (menuItems) {
        gsap.fromTo(menuItems,
          {
            opacity: 0,
            x: 50,
            rotationY: 15
          },
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
          }
        );
      }
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/20 backdrop-blur-lg border-b border-cyan-400/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-cyan-400 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-lg font-mono">JL</span>
              </div>
              <span className="text-white font-bold text-xl font-mono group-hover:text-cyan-400 transition-colors">
                JcxaL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group px-4 py-2 font-mono text-sm transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Animated underline */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-cyan-400 transition-all duration-300 ${
                    pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-cyan-400/10 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen 
            ? 'bg-black/80 backdrop-blur-lg opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      >
        <div
          ref={menuRef}
          className={`absolute top-20 left-6 right-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-lg border border-cyan-400/20 p-6 transform transition-all duration-300 ${
            isOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMenu}
                className={`menu-item flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-mono font-medium">{item.label}</span>
                
                {/* Active indicator */}
                {pathname === item.href && (
                  <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* Menu decoration */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <p className="text-center text-gray-400 text-sm font-mono mt-2">
              SYSTEM ONLINE
            </p>
          </div>
        </div>
      </div>

      {/* Navigation background pattern */}
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-30 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            background: `
              linear-gradient(90deg, transparent 0%, var(--cyan) 50%, transparent 100%),
              repeating-linear-gradient(90deg, 
                transparent, 
                transparent 20px, 
                var(--folly) 20px, 
                var(--folly) 21px
              )
            `,
            animation: 'navPattern 10s linear infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes navPattern {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(100px); }
        }
      `}</style>
    </>
  );
};

export default FuturisticNavigation; 