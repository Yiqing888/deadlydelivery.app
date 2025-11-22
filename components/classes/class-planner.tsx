"use client";

import { useMemo, useState } from "react";

import type { ClassInfo } from "@/data/classes";
import { classInfos } from "@/data/classes";

const playstyles = [
  { id: "steady", label: "Steady income" },
  { id: "combat", label: "Fight heavy" },
  { id: "runner", label: "Speedrunner" },
  { id: "support", label: "Support-minded" },
] as const;

type Playstyle = (typeof playstyles)[number]["id"];

const preferenceOrder: Record<Playstyle, string[]> = {
  steady: ["odd-jobber", "sprinter", "porter", "veterinarian"],
  combat: ["odd-jobber", "baseballer", "veterinarian", "porter"],
  runner: ["odd-jobber", "sprinter", "porter", "baseballer"],
  support: ["odd-jobber", "veterinarian", "chef", "porter"],
};

const classById = Object.fromEntries(classInfos.map((info) => [info.id, info]));

export default function ClassPlanner() {
  const [gold, setGold] = useState(6000);
  const [style, setStyle] = useState<Playstyle>("steady");

  const plan = useMemo(() => buildPlan(gold, style), [gold, style]);

  return (
    <div className="space-y-6">
      <form className="grid gap-4 border border-theme-surface bg-theme-dark/60 p-5 text-sm text-gray-400">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Current gold
          </span>
          <input
            type="number"
            min={0}
            value={gold}
            onChange={(event) => {
              const value = Number(event.target.value);
              setGold(Number.isNaN(value) ? 0 : value);
            }}
            className="w-full rounded-sm border border-theme-surface bg-theme-dark text-gray-100 focus:border-theme-hazard focus:ring-0"
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Preferred style
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {playstyles.map((option) => {
              const active = style === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setStyle(option.id)}
                  className={`border px-3 py-2 text-left text-xs font-mono transition ${
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
      </form>

      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Suggested unlock path
        </p>
        <ol className="space-y-3">
          {plan.map((step, index) => (
            <li
              key={step.class.id}
              className="border border-theme-surface bg-black/30 p-4 text-sm text-gray-200"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Step {index + 1}
              </p>
              <p className="text-lg font-creepster tracking-wider text-theme-hazard">
                {step.class.name}
              </p>
              <p className="text-xs font-mono text-gray-400">
                Unlock cost: {step.class.unlockCost.toLocaleString()} cr
              </p>
              <p className="mt-2 text-sm">{step.reason}</p>
              {step.wait > 0 ? (
                <p className="mt-1 text-xs text-gray-500">
                  Need approximately {step.wait.toLocaleString()} more credits.
                </p>
              ) : (
                <p className="mt-1 text-xs text-green-400">You can afford this now.</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function buildPlan(gold: number, style: Playstyle) {
  const sequence = [...preferenceOrder[style], "sprinter", "porter", "baseballer", "chef"];
  const seen = new Set<string>();
  const ordered = sequence.filter((id) => {
    if (seen.has(id)) return false;
    if (!classById[id]) return false;
    seen.add(id);
    return true;
  });

  return ordered.slice(0, 4).map((id, index) => {
    const info = classById[id] as ClassInfo;
    const wait = Math.max(0, info.unlockCost - gold);
    let reason = "Reliable upgrade over Odd Jobber.";

    if (index === 0 && info.unlockCost === 0) {
      reason = "Stay here until you internalize every monster and loot curve.";
    } else if (info.role === "Runner") {
      reason = "Speed gets you to elevators faster and salvages greedy pushes.";
    } else if (info.role === "Support") {
      reason = "Keeps squads healthy so they can greed more floors.";
    } else if (info.role === "Carry") {
      reason = "Bigger bags turn every run into cash even with average loot.";
    } else if (info.role === "DPS") {
      reason = "Delete priority mobs and protect Porters or Sprinters.";
    }

    return {
      class: info,
      wait,
      reason,
    };
  });
}
