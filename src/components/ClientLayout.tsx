"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

// Lazy load heavy animation components for better performance
const LiquidMenu = dynamic(() => import("@/components/LiquidMenu"), {
  ssr: false,
});
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
});
const MatrixRain = dynamic(() => import("@/components/MatrixRain"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // JccL Line routes own their entire viewport: no legacy chrome (cursor,
  // particles, nav, theme, pt-24 offset). The metro shell replaces this
  // layout wholesale as the rebuild progresses (docs/design/10-roadmap.md).
  if (pathname?.startsWith("/station")) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <ThemeProvider>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-cyan-400 focus:text-black focus:rounded-lg focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      {/* Background Effects Layer - Behind everything */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -20 }} aria-hidden="true">
        <div style={{ opacity: 0.15 }}>
          <MatrixRain />
        </div>
      </div>
      
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -10 }} aria-hidden="true">
        <div style={{ opacity: 0.2 }}>
          <ParticleBackground />
        </div>
      </div>
      
      {/* Interactive Elements - High z-index */}
      <CustomCursor />
      <ScrollProgress />
      
      {/* Navigation - Very high z-index */}
      <div style={{ zIndex: 1000 }}>
        <LiquidMenu />
      </div>
      
      {/* Main Content - High z-index but below navigation */}
      <main id="main-content" className="relative min-h-screen pt-24" style={{ zIndex: 10 }} role="main">
        {children}
      </main>
      
      {/* Subtle ambient lighting effects - Behind main content */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -5,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 31, 75, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 128, 255, 0.02) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </ThemeProvider>
  );
}
