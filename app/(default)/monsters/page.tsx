import MonsterCards from "@/components/monsters/monster-cards";
import { monsters } from "@/data/monsters";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Deadly Delivery Monster Reference",
  description: "Fast monster lookup table with spawn floors, attack patterns, and counters.",
  canonical: "/monsters",
  keywords: ["Deadly Delivery monsters", "Deadly Delivery monster counters"],
});

const quickTips = [
  "Ping vents before looting to avoid Pit Maws.",
  "Stuns and coolant are gold for Fire Turkey floors.",
  "If you suspect a Clone, spam emotes--impostors can't mimic HUD spam.",
];

export default function MonstersPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-4 text-center">
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">Threat brief</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood sm:text-5xl">
          Monsters cheat sheet
        </h1>
        <p className="text-base text-gray-400 font-courier">
          No more doom-scrolling wikis mid-run. Keep this tab pinned and skim attack patterns before the
          elevator vote.
        </p>
        <div className="flex flex-col gap-2 rounded-sm border-2 border-theme-surface bg-theme-surface/30 p-4 text-sm text-gray-300 font-mono sm:flex-row sm:items-center sm:justify-center">
          {quickTips.map((tip) => (
            <p key={tip}>• {tip}</p>
          ))}
        </div>
      </header>

      <MonsterCards data={monsters} />
    </section>
  );
}
