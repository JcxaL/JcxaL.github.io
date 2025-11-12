import type { Metadata } from "next";
import { getTravelGuideDrafts, getTravelLocations } from "@/lib/travel";

export const metadata: Metadata = {
  title: "Travel Mission Control | JcxaL",
  description:
    "Live travel tracker with map view, destination backlog, and self-authored field guides.",
};

export default function Travel() {
  const { visited: visitedLocations, onDeck: onDeckLocations } =
    getTravelLocations();
  const guideDrafts = getTravelGuideDrafts();

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-[#04050d] via-[#0e1628] to-[#151f33] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">
            Field Ops
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Travel Mission Control
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            The travel section leads the rebuild. Follow the evolving map,
            backlog, and guide drafts while other verticals incubate.
          </p>
        </header>

        {/* Map + Legend */}
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-transparent p-6 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.3),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,31,75,0.25),transparent_35%)]"
            />
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Map View (Preview)</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Deck Mode
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Interactive Mapbox layer coming soon. For now, follow the plotted
              coordinates of current missions.
            </p>
            <div className="relative h-72 rounded-xl border border-white/5 bg-[#050913] overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:40px_40px]" />
              {[...visitedLocations, ...onDeckLocations].map((loc, index) => (
                <div
                  key={loc.id}
                  className="absolute flex flex-col items-center text-center"
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${30 + (index % 3) * 20}%`,
                  }}
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">
                    {index < visitedLocations.length ? "Visited" : "On Deck"}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
                  <p className="text-sm font-semibold mt-2">{loc.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Legend
              </p>
            </div>
            <ul className="divide-y divide-white/5">
              <li className="p-6 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                <div>
                  <p className="font-semibold">Visited Coordinates</p>
                  <p className="text-sm text-gray-400">
                    Locations with field notes + assets ready for guides.
                  </p>
                </div>
              </li>
              <li className="p-6 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.8)]" />
                <div>
                  <p className="font-semibold">On Deck</p>
                  <p className="text-sm text-gray-400">
                    Scheduled missions currently in research & logistics mode.
                  </p>
                </div>
              </li>
              <li className="p-6 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                <div>
                  <p className="font-semibold">Guide Drafts</p>
                  <p className="text-sm text-gray-400">
                    MDX guides being authored — expect release dates below.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* List View */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                List View
              </p>
              <h2 className="text-3xl font-semibold">Mission Ledger</h2>
            </div>
            <span className="text-sm text-gray-400">
              Scroll sync + filters arriving once CMS wiring is ready.
            </span>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-300 tracking-[0.2em] uppercase">
                Visited
              </h3>
              {visitedLocations.map((loc) => (
                <article
                  key={loc.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold">{loc.name}</h4>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      {loc.season}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{loc.highlight}</p>
                  <div className="flex flex-wrap gap-2">
                    {loc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-fuchsia-300 tracking-[0.2em] uppercase">
                On Deck
              </h3>
              {onDeckLocations.map((loc) => (
                <article
                  key={loc.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold">{loc.name}</h4>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-300">
                      {loc.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mb-3">{loc.mission}</p>
                  <div className="flex flex-wrap gap-2">
                    {loc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-white/10 text-white border border-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Guide Drafts */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Author Room
              </p>
              <h2 className="text-3xl font-semibold">
                Guides in Production
              </h2>
            </div>
            <span className="text-sm text-gray-400">
              Full MDX pipeline hooks in after schema finalization.
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guideDrafts.map((guide) => (
              <article
                key={guide.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  {guide.eta}
                </p>
                <h3 className="text-xl font-semibold">{guide.title}</h3>
                <p className="text-sm text-gray-300 flex-1">{guide.status}</p>
                <p className="text-xs text-amber-300 uppercase tracking-[0.3em]">
                  Draft Mode
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
            Next Up
          </p>
          <h3 className="text-2xl font-semibold">
            Travel leads the launch sequence. Other sections are in standby.
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Subscribe or ping me to beta test the upcoming map engine, interactive
            packing overlay, and narrative guides before they ship to the main
            homepage experience.
          </p>
        </footer>
      </div>
    </div>
  );
}
