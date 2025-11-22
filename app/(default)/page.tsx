import Link from "next/link";

import ProfitCalculator from "@/components/profit-calculator";
import { items } from "@/data/items";
import { monsters } from "@/data/monsters";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Deadly Delivery Loot Calculator",
  description:
    "Mobile-first Deadly Delivery profit calculator balancing loot value, monster danger, and vote timers so you know when to extract or go deeper.",
  canonical: "/",
  keywords: ["Deadly Delivery calculator", "Deadly Delivery vote helper"],
});

const topDensity = [...items]
  .map((item) => ({
    ...item,
    density: Number((item.value / item.slots).toFixed(1)),
  }))
  .sort((a, b) => b.density - a.density)
  .slice(0, 3);

const dangerousMonsters = monsters.filter((monster) => monster.dangerLevel === 3).slice(0, 3);

export default function Home() {
  return (
    <>
      <ProfitCalculator />

      <section className="bg-theme-dark py-24 border-t border-theme-surface relative overflow-hidden">
        {/* Background texture/grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col gap-16 lg:flex-row">
            {/* Loot Radar */}
            <div className="flex-1 rounded-sm border-2 border-theme-surface bg-theme-surface/30 p-10 shadow-lg backdrop-blur-sm">
              <p className="text-base uppercase tracking-widest text-theme-hazard font-bold mb-4">Loot radar</p>
              <h2 className="text-5xl font-creepster tracking-wider text-gray-200 mb-4">
                Top value-per-slot pickups
              </h2>
              <p className="text-lg text-gray-500 font-mono mb-10">
                Memorize these and you can speed-run the vote inputs.
              </p>
              <ul className="space-y-6">
                {topDensity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border border-theme-surface bg-black/40 px-6 py-5 text-base hover:border-theme-hazard transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-gray-300 group-hover:text-theme-hazard transition-colors uppercase tracking-wide text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600 font-mono mt-1">{item.value} cr · {item.slots} slots</p>
                    </div>
                    <span className="text-2xl font-bold text-theme-hazard font-mono">
                      {item.density} /slot
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/items"
                className="mt-10 inline-flex items-center text-base font-bold text-theme-blood hover:text-red-400 uppercase tracking-wider transition-colors"
              >
                Browse the full price table →
              </Link>
            </div>

            {/* Threat Board */}
            <div className="flex-1 rounded-sm border-2 border-theme-blood/30 bg-theme-blood/5 p-10 shadow-lg backdrop-blur-sm relative overflow-hidden">
              {/* Hazard stripes on top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,var(--color-theme-blood),var(--color-theme-blood)_10px,transparent_10px,transparent_20px)] opacity-50"></div>

              <p className="text-base uppercase tracking-widest text-theme-blood font-bold mb-4">Threat board</p>
              <h2 className="text-5xl font-creepster tracking-wider text-gray-200 mb-4">High danger entities</h2>
              <p className="text-lg text-gray-500 font-mono mb-10">Quick cues for the next debate.</p>
              <ul className="space-y-6">
                {dangerousMonsters.map((monster) => (
                  <li key={monster.id} className="border border-theme-blood/30 bg-black/40 p-6 relative group hover:border-theme-blood transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-lg font-bold text-gray-200 uppercase tracking-wide group-hover:text-theme-blood transition-colors">{monster.name}</p>
                      <span className="text-xs border border-theme-blood text-theme-blood px-2 py-0.5 uppercase">Danger Lvl 3</span>
                    </div>
                    <p className="text-sm text-gray-600 font-mono mb-4">
                      Floors {monster.floors?.join(", ") ?? "?"} · {monster.descriptionShort}
                    </p>
                    <p className="text-base text-gray-400 font-mono border-t border-gray-800 pt-3 mt-3">
                      <span className="text-theme-hazard text-sm uppercase mr-2">Strategy:</span>
                      {monster.counterStrategy}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/monsters"
                className="mt-10 inline-flex items-center text-base font-bold text-theme-blood hover:text-red-400 uppercase tracking-wider transition-colors"
              >
                See the full monster desk →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
