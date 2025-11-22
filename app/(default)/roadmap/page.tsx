import PlanBuilder from "@/components/roadmap/plan-builder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Deadly Delivery 10-Run Roadmap",
  description: "Generate a 10-run plan with floor targets and reminders for your preferred playstyle.",
  canonical: "/roadmap",
  keywords: ["Deadly Delivery roadmap", "Deadly Delivery run plan"],
});

export default function RoadmapPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <header className="mb-12 space-y-4 text-center">
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">First 10 runs</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Roadmap generator
        </h1>
        <p className="text-base text-gray-400 font-mono">
          Pick your style and whether you have a regular squad. We spit out a run-by-run checklist so no one has to read a 4,000 word guide mid-queue.
        </p>
      </header>

      <PlanBuilder />
    </section>
  );
}
