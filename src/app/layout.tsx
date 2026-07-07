import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Doto } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Signage voice - MTR Myriad register (docs/design/12-brand-signage.md)
const signage = Source_Sans_3({
  variable: "--font-signage",
  subsets: ["latin"],
});

// Departure-board voice - dot-matrix display face; boards only, never body
const board = Doto({
  variable: "--font-board",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jcxal.github.io'),
  title: {
    default: "JcxaL - Future Tech Developer",
    template: "%s | JcxaL"
  },
  description: "Welcome to my futuristic digital realm - Showcasing cutting-edge technology and innovative solutions",
  keywords: ["developer", "technology", "futuristic", "web development", "programming", "innovation", "Next.js", "React", "TypeScript", "travel", "photography", "design"],
  authors: [{ name: "JcxaL", url: "https://jcxal.github.io" }],
  creator: "JcxaL",
  publisher: "JcxaL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jcxal.github.io',
    siteName: 'JcxaL',
    title: 'JcxaL - Future Tech Developer',
    description: 'Welcome to my futuristic digital realm - Showcasing cutting-edge technology and innovative solutions',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JcxaL - Future Tech Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JcxaL - Future Tech Developer',
    description: 'Welcome to my futuristic digital realm - Showcasing cutting-edge technology and innovative solutions',
    images: ['/og-image.png'],
    creator: '@jcxal',
  },
  verification: {
    google: 'your-google-site-verification-code',
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
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "JcxaL",
              "url": "https://jcxal.github.io",
              "sameAs": [
                "https://github.com/JcxaL"
              ],
              "jobTitle": "Software Developer",
              "description": "Future Tech Developer specializing in web development, design, and innovative solutions",
              "knowsAbout": ["Web Development", "React", "Next.js", "TypeScript", "UI/UX Design", "Photography", "Travel"],
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${signage.variable} ${board.variable} antialiased min-h-screen`}
        style={{
          fontFamily: 'var(--font-signage), var(--font-geist-sans), system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #0e131f 0%, #38405f 50%, #59546c 100%)',
          position: 'relative',
        }}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
