import Link from "next/link";

import ProfitCalculator from "@/components/profit-calculator";
import { items } from "@/data/items";
import { monsters } from "@/data/monsters";

export const metadata = {
  title: "Deadly Delivery Run Planner",
  description:
    "Quick EV calculator plus loot and monster intel for Deadly Delivery players debating one more floor.",
};

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

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase text-blue-600">Loot radar</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Top value-per-slot pickups right now
              </h2>
              <p className="text-sm text-gray-600">
                Memorize these and you can speed-run the vote inputs.
              </p>
              <ul className="mt-6 space-y-3">
                {topDensity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.value} cr · {item.slots} slots</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {item.density} /slot
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/items"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600"
              >
                Browse the full price table →
              </Link>
            </div>

            <div className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase text-blue-600">Threat board</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">High danger entities</h2>
              <p className="text-sm text-gray-600">Quick cues for the next debate.</p>
              <ul className="mt-6 space-y-4">
                {dangerousMonsters.map((monster) => (
                  <li key={monster.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">{monster.name}</p>
                    <p className="text-xs text-gray-500">
                      Floors {monster.floors?.join(", ") ?? "?"} · {monster.descriptionShort}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{monster.counterStrategy}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/monsters"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600"
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
