"use client";

import { useMemo, useState } from "react";

import type { RunPlan, RunStyle } from "@/lib/roadmap";
import { generateRunPlan } from "@/lib/roadmap";

const styles: Array<{ id: RunStyle; label: string }> = [
  { id: "safe", label: "Safe" },
  { id: "balanced", label: "Balanced" },
  { id: "greedy", label: "Greedy" },
];

export default function PlanBuilder() {
  const [style, setStyle] = useState<RunStyle>("balanced");
  const [hasSquad, setHasSquad] = useState(true);

  const plan = useMemo(() => generateRunPlan(style, hasSquad), [style, hasSquad]);

  return (
    <div className="space-y-6">
      <form className="grid gap-4 border border-theme-surface bg-theme-dark/60 p-5 text-sm text-gray-400">
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Playstyle
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {styles.map((option) => {
              const active = option.id === style;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setStyle(option.id)}
                  className={`border px-3 py-2 text-sm font-mono transition ${
                    active
                      ? "border-theme-hazard bg-theme-hazard/20 text-theme-hazard"
                      : "border-theme-surface bg-theme-dark text-gray-600 hover:border-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500">
          <input
            type="checkbox"
            checked={hasSquad}
            onChange={(event) => setHasSquad(event.target.checked)}
            className="h-4 w-4 rounded border-theme-surface bg-theme-dark text-theme-hazard focus:ring-theme-hazard"
          />
          Stable squad available
        </label>
      </form>

      <Timeline plan={plan} />
    </div>
  );
}

function Timeline({ plan }: { plan: RunPlan[] }) {
  return (
    <ol className="space-y-4">
      {plan.map((run) => (
        <li
          key={run.runIndex}
          className="relative border-l-2 border-theme-surface pl-6 text-sm text-gray-300"
        >
          <div className="absolute -left-[11px] top-1.5 h-3 w-3 rounded-full border border-theme-hazard bg-black"></div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Run {run.runIndex}
          </p>
          <p className="text-base font-creepster tracking-wider text-theme-hazard">
            Target floor {run.targetFloor}
          </p>
          <p className="text-sm text-gray-200">{run.focus}</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            {run.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span aria-hidden className="text-theme-hazard">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
