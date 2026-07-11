import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Doto } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import { ViewTransitions } from "next-view-transitions";
import { NO_FLASH_SCRIPT } from "@/lib/theme/themeStore";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import SiteHeader from "@/components/chrome/SiteHeader";
import SiteFooter from "@/components/chrome/SiteFooter";
import DuotoneDefs from "@/components/media/DuotoneDefs";

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

// Departure-board voice - dot-matrix display face; boards only, never body.
// ROND axis loaded for the two reserved axis-animation moments (doc 12):
// exhibit arrival name + ticket validation.
const board = Doto({
  variable: "--font-board",
  subsets: ["latin"],
  axes: ["ROND"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jcxal.github.io"),
  title: {
    default: "The JccL Line — a travel network by JccL",
    template: "%s · The JccL Line",
  },
  description:
    "A personal museum of places, entered through the Metro. Travel journals, photography, and field notes by JccL — one station at a time.",
  keywords: [
    "travel",
    "travel journal",
    "photography",
    "field notes",
    "metro",
    "JccL",
  ],
  authors: [{ name: "JccL", url: "https://jcxal.github.io" }],
  creator: "JccL",
  publisher: "JccL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jcxal.github.io",
    siteName: "The JccL Line",
    title: "The JccL Line — a travel network by JccL",
    description:
      "A personal museum of places, entered through the Metro. Travel journals, photography, and field notes — one station at a time.",
  },
  twitter: {
    card: "summary",
    title: "The JccL Line — a travel network by JccL",
    description:
      "A personal museum of places, entered through the Metro. Travel journals, photography, and field notes — one station at a time.",
  },
};

export const viewport: Viewport = {
  // Mirrors the --color-ground-0 token (station black); meta tags can't read CSS vars.
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
    <html lang="en">
      <head>
        {/* Apply an explicit theme choice before paint (no flash). System-
            preference users are handled by the CSS media query — untouched. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "JccL",
              url: "https://jcxal.github.io",
              sameAs: ["https://github.com/JcxaL"],
              description:
                "Traveller and photographer publishing journals and field notes as The JccL Line.",
              knowsAbout: ["Travel", "Photography", "Web Development"],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${signage.variable} ${board.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:font-semibold focus:rounded-md"
          style={{
            backgroundColor: "var(--color-board-amber)",
            color: "var(--color-ink-inverse)",
          }}
        >
          Skip to concourse
        </a>
        <DuotoneDefs />
        <SmoothScrollProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
