import type { ClassInfo } from "@/data/classes";

export default function ClassCard({ info }: { info: ClassInfo }) {
  return (
    <article className="flex flex-col gap-4 border border-theme-surface bg-theme-dark/50 p-5 text-sm text-gray-400">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-creepster tracking-wider text-gray-100">{info.name}</h3>
          <p className="text-xs uppercase tracking-widest text-theme-hazard">
            Tier {info.tier} · {info.role}
          </p>
        </div>
        <span className="text-xs font-mono text-gray-500">
          Unlocks: {info.unlockCost.toLocaleString()} cr
        </span>
      </div>

      <p className="text-sm leading-relaxed">{info.description}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase text-green-500">Pros</p>
          <ul className="mt-1 space-y-1 text-xs">
            {info.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span aria-hidden className="text-green-500">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-theme-blood">Cons</p>
          <ul className="mt-1 space-y-1 text-xs">
            {info.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span aria-hidden className="text-theme-blood">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase text-gray-500">Best for</p>
        <p className="font-mono text-xs text-gray-300">
          {info.recommendedFor.join(" · ")}
        </p>
      </div>
    </article>
  );
}
