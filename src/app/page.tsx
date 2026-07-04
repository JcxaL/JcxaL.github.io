import Link from "next/link";

type SectionState = "active" | "standby";

interface NavSection {
  href: string;
  label: string;
  emoji: string;
  color: string;
  status: SectionState;
  note: string;
}

const navSections: NavSection[] = [
  {
    href: "/travel",
    label: "Travel",
    emoji: "✈️",
    color: "from-blue-500/30 to-cyan-500/30",
    status: "active",
    note: "Build in progress",
  },
  {
    href: "/photography",
    label: "Photography",
    emoji: "📸",
    color: "from-purple-500/20 to-pink-500/20",
    status: "standby",
    note: "Greyed until travel ships",
  },
  {
    href: "/music",
    label: "Music",
    emoji: "🎵",
    color: "from-green-500/20 to-emerald-500/20",
    status: "standby",
    note: "Instrument lab queued",
  },
  {
    href: "/design",
    label: "Design",
    emoji: "🎨",
    color: "from-orange-500/20 to-red-500/20",
    status: "standby",
    note: "Map engine prototype in R&D",
  },
  {
    href: "/blog",
    label: "Blog",
    emoji: "✍️",
    color: "from-yellow-500/20 to-amber-500/20",
    status: "standby",
    note: "Content paused",
  },
  {
    href: "/contact",
    label: "Contact",
    emoji: "✉️",
    color: "from-indigo-500/20 to-blue-500/20",
    status: "standby",
    note: "Will reopen post-travel release",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-white relative px-4 py-8">
      {/* Main Content Container */}
      <div className="container mx-auto max-w-6xl">
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 
            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-red-400 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          >
            JcxaL
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-6">
            Welcome to my personal website
          </p>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Rebuild mission: Travel section first, everything else taxiing on the
            runway. Expect greyed modules until the flagship experience ships.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="flex gap-6 items-center flex-wrap justify-center mb-20">
          {/* GitHub Link */}
          <a
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md rounded-lg border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-3 text-white hover:text-cyan-400 transform hover:scale-105"
            href="https://github.com/JcxaL"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">GitHub</span>
          </a>

          {/* About Me Link */}
          <Link
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-lg border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 flex items-center gap-3 text-cyan-400 hover:text-white transform hover:scale-105"
            href="/about"
            style={{
              boxShadow: '0 4px 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(0, 255, 255, 0.1)'
            }}
          >
            <span className="font-medium">About Me</span>
          </Link>
        </section>

        {/* Page Navigation */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400">
            Explore My World
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {navSections.map((item) => {
              if (item.status === "active") {
                return (
                  <Link
                    key={item.href}
                    className={`group relative p-6 bg-gradient-to-br ${item.color} backdrop-blur-md rounded-xl border border-cyan-300/40 transition-all duration-300 text-center transform hover:scale-105 hover:-translate-y-2`}
                    href={item.href}
                    style={{
                      boxShadow: "0 12px 40px rgba(14, 202, 240, 0.25)",
                    }}
                  >
                    <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.4em] text-cyan-200">
                      Active
                    </div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="text-white font-semibold text-base">
                      {item.label}
                    </div>
                    <p className="text-xs text-cyan-100 mt-2">{item.note}</p>
                  </Link>
                );
              }

              return (
                <div
                  key={item.href}
                  className={`relative p-6 bg-gradient-to-br ${item.color} backdrop-blur-md rounded-xl border border-white/5 text-center cursor-default opacity-40 grayscale`}
                  style={{
                    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.35)",
                  }}
                  aria-disabled="true"
                >
                  <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.4em] text-gray-500">
                    Standby
                  </div>
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <div className="text-white font-medium text-sm">
                    {item.label}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{item.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 JcxaL. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
