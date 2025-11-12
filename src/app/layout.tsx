import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LiquidMenu from "@/components/LiquidMenu";
import ParticleBackground from "@/components/ParticleBackground";
import MatrixRain from "@/components/MatrixRain";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JcxaL - Future Tech Developer",
  description: "Welcome to my futuristic digital realm - Showcasing cutting-edge technology and innovative solutions",
  keywords: "developer, technology, futuristic, web development, programming, innovation",
  authors: [{ name: "JcxaL" }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0e131f" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{
          fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #0e131f 0%, #38405f 50%, #59546c 100%)',
          position: 'relative',
        }}
      >
        {/* Background Effects Layer - Behind everything */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -20 }}>
          <div style={{ opacity: 0.15 }}>
            <MatrixRain />
          </div>
        </div>
        
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -10 }}>
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
        <main className="relative min-h-screen pt-24" style={{ zIndex: 10 }}>
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
        />
      </body>
    </html>
  );
}
