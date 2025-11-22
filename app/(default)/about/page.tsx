import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Deadly Delivery Run Planner",
  description: "Project goals, data sources, and contact info for the Run Planner toolkit.",
  canonical: "/about",
  keywords: ["Deadly Delivery about", "Deadly Delivery data sources"],
});

const sections = [
  {
    title: "What is this?",
    body:
      "A lightweight decision aid for the Roblox Deadly Delivery community. The calculator gives a gut-check before each elevator vote, while the loot, monster, class, and roadmap tabs condense popular guide info into fast-scrolling modules.",
  },
  {
    title: "Data sources",
    body:
      "Item prices and monster blurbs are pulled from Bloxinformer, in-game Album screenshots, and squad spreadsheets. Class notes reference tier lists from Sportskeeda, DroidGamers, and Discord analysts. Everything is hand-edited--expect tweaks after each balance patch.",
  },
  {
    title: "How to contribute",
    body:
      "Send feedback in Discord (tag @run-planner) or drop a pull request once you have better numbers. Priority #1 is keeping loot values accurate, #2 is tuning the risk curve based on real run data.",
  },
  {
    title: "Roadmap",
    body:
      "Next up: monster quiz drills, backpack presets per class, and eventually a shareable vote log so teams can audit greed vs. profits.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 text-gray-300">
      <header className="mb-12 space-y-4 text-center">
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">About</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Deadly Delivery Run Planner
        </h1>
        <p className="text-base text-gray-400 font-mono">
          Built as a squad companion, not an exploit--everything runs client side and uses community-sourced data.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <article key={section.title} className="border border-theme-surface bg-black/30 p-6">
            <h2 className="text-2xl font-creepster tracking-wider text-theme-hazard mb-2">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
