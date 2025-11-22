import ClassCard from "@/components/classes/class-card";
import ClassPlanner from "@/components/classes/class-planner";
import { classInfos } from "@/data/classes";

export const metadata = {
  title: "Deadly Delivery Class Planner",
  description: "Compare classes and get a suggested unlock route based on your gold and playstyle.",
};

export default function ClassesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <header className="mb-12 space-y-4 text-center">
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">Unlock order</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Class planner & cheat sheet
        </h1>
        <p className="text-base text-gray-400 font-mono">
          Figure out which profession to unlock next, read the pros/cons, and feed that back into the stop-loss calculator.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {classInfos.map((info) => (
          <ClassCard key={info.id} info={info} />
        ))}
      </div>

      <div className="mt-12">
        <ClassPlanner />
      </div>
    </section>
  );
}
