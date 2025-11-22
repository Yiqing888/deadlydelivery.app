"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalculatorInput,
  CalculationResult,
  PlayerClass,
  RiskPreference,
  TimeLeftTier,
  runCalculation,
} from "@/lib/calculator";
import { items } from "@/data/items";

const classes: PlayerClass[] = [
  "Odd Jobber",
  "Veterinarian",
  "Chef",
  "Sprinter",
  "Baseballer",
  "Porter",
];

const preferences: { label: string; value: RiskPreference }[] = [
  { label: "Conservative 保守", value: "SAFE" },
  { label: "Balanced 中性", value: "NORMAL" },
  { label: "Greedy 冒险", value: "RISKY" },
];

const timeOptions: { label: string; value: TimeLeftTier }[] = [
  { label: "Plenty (>60s)", value: "HIGH" },
  { label: "Tight (30-60s)", value: "MID" },
  { label: "Scramble (<30s)", value: "LOW" },
];

type InventoryMode = "quick" | "detailed";

const detailCatalog = [...items]
  .map((item) => ({
    ...item,
    density: item.value / (item.slots || 1),
  }))
  .sort((a, b) => b.density - a.density);

const initialForm: CalculatorInput = {
  currentFloor: 1,
  targetFloor: 2,
  alivePlayers: 4,
  playerClass: "Odd Jobber",
  inventoryValue: 600,
  timeLeftTier: null,
  riskPreference: "NORMAL",
};

export default function ProfitCalculator() {
  const [form, setForm] = useState<CalculatorInput>(initialForm);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [inventoryMode, setInventoryMode] = useState<InventoryMode>("quick");
  const [detailCounts, setDetailCounts] = useState<Record<string, number>>({});
  const [detailSearch, setDetailSearch] = useState("");

  const isReady = useMemo(() => {
    return form.currentFloor > 0 && form.alivePlayers > 0 && form.inventoryValue > 0;
  }, [form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isReady) return;
    setResult(runCalculation(form));
  };

  const toneColors: Record<CalculationResult["tone"], string> = {
    danger: "border-theme-blood bg-theme-blood/10 text-theme-blood",
    neutral: "border-theme-hazard bg-theme-hazard/10 text-theme-hazard",
    success: "border-green-500 bg-green-500/10 text-green-500",
  };

  const detailTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const count = detailCounts[item.id] ?? 0;
      return total + count * item.value;
    }, 0);
  }, [detailCounts]);

  useEffect(() => {
    if (inventoryMode === "detailed") {
      setForm((prev) => ({
        ...prev,
        inventoryValue: detailTotal,
      }));
    }
  }, [detailTotal, inventoryMode]);

  const inventoryValueDisplay =
    inventoryMode === "detailed" ? detailTotal : form.inventoryValue;

  const filteredDetailItems = useMemo(() => {
    const query = detailSearch.trim().toLowerCase();
    if (!query) return detailCatalog;
    return detailCatalog.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.alias?.some((alias) => alias.toLowerCase().includes(query)),
    );
  }, [detailSearch]);

  const handleDetailCountChange = (itemId: string, value: number) => {
    setDetailCounts((prev) => {
      const sanitized = Number.isNaN(value) ? 0 : value;
      const nextValue = Math.max(0, sanitized);
      if (nextValue === 0) {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: nextValue };
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">Sewer Sherpa</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood sm:text-6xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Deadly Delivery Profit & Risk Calculator
        </h1>
        <p className="text-base text-gray-400 font-courier max-w-2xl mx-auto">
          Plug in your current floor, backpack haul, and squad health. We crunch a quick EV (期望收益)
          check and tell you if it&apos;s smarter to evacuate or go deeper.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-sm border-2 border-theme-surface bg-theme-surface/50 p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden"
        >
          {/* Decorative corner markers */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-theme-hazard opacity-50"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-theme-hazard opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-theme-hazard opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-theme-hazard opacity-50"></div>

          <div className="mb-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400 uppercase tracking-wider">
                Current floor / 当前楼层
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={form.currentFloor}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isNaN(value)) return;
                    setForm((prev) => ({
                      ...prev,
                      currentFloor: value,
                      targetFloor: Math.min(20, value + 1),
                    }));
                  }}
                  className="w-full accent-theme-hazard h-2 bg-theme-dark rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-center text-2xl font-creepster text-theme-hazard">
                  {form.currentFloor}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Target floor (optional)
                  <input
                    type="number"
                    min={form.currentFloor + 1}
                    max={20}
                    value={form.targetFloor}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setForm((prev) => ({
                        ...prev,
                        targetFloor: Number.isNaN(value)
                          ? prev.currentFloor + 1
                          : Math.min(20, Math.max(prev.currentFloor + 1, value)),
                      }));
                    }}
                    className="mt-2 w-full bg-theme-dark border-theme-surface text-gray-200 focus:border-theme-hazard focus:ring-0 rounded-sm"
                  />
                </label>
                <p className="border border-dashed border-gray-700 p-3 text-xs text-gray-500 font-mono">
                  We default to evaluating the very next floor. Adjust if you already planned a deeper
                  push.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400 uppercase tracking-wider">
                Squad alive / 存活人数
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((value) => {
                  const active = form.alivePlayers === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          alivePlayers: value,
                        }))
                      }
                      className={`border-2 px-3 py-2 text-sm font-bold transition uppercase ${active
                          ? "border-theme-hazard bg-theme-hazard/20 text-theme-hazard"
                          : "border-theme-surface bg-theme-dark text-gray-600 hover:border-gray-600"
                        }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400 uppercase tracking-wider">
                Player class / 职业
              </label>
              <select
                value={form.playerClass}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    playerClass: event.target.value as PlayerClass,
                  }))
                }
                className="w-full bg-theme-dark border-theme-surface text-gray-200 focus:border-theme-hazard focus:ring-0 rounded-sm"
              >
                {classes.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400 uppercase tracking-wider">
                Backpack value / 背包总价值 (credits)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={inventoryValueDisplay}
                disabled={inventoryMode === "detailed"}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (Number.isNaN(value)) return;
                  setForm((prev) => ({
                    ...prev,
                    inventoryValue: value,
                  }));
                }}
                placeholder="Estimate from Album"
                className="w-full bg-theme-dark border-theme-surface text-gray-200 focus:border-theme-hazard focus:ring-0 rounded-sm placeholder-gray-700 disabled:cursor-not-allowed disabled:text-gray-500"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500">
                <span>Mode:</span>
                <button
                  type="button"
                  onClick={() => setInventoryMode("quick")}
                  className={`rounded-sm border px-2 py-1 transition ${
                    inventoryMode === "quick"
                      ? "border-theme-hazard text-theme-hazard"
                      : "border-theme-surface text-gray-600 hover:border-gray-600"
                  }`}
                >
                  Quick entry
                </button>
                <button
                  type="button"
                  onClick={() => setInventoryMode("detailed")}
                  className={`rounded-sm border px-2 py-1 transition ${
                    inventoryMode === "detailed"
                      ? "border-theme-hazard text-theme-hazard"
                      : "border-theme-surface text-gray-600 hover:border-gray-600"
                  }`}
                >
                  Detailed inventory
                </button>
                {inventoryMode === "detailed" && (
                  <span className="text-theme-hazard">
                    Auto total: {detailTotal.toLocaleString()} cr
                  </span>
                )}
              </div>
              {inventoryMode === "detailed" && (
                <div className="mt-4 space-y-3 border border-dashed border-gray-700 bg-black/30 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Build backpack from catalog
                    </p>
                    <input
                      type="text"
                      placeholder="Search loot"
                      value={detailSearch}
                      onChange={(event) => setDetailSearch(event.target.value)}
                      className="w-full bg-theme-dark border-theme-surface text-gray-200 placeholder-gray-700 focus:border-theme-hazard focus:ring-0 rounded-sm sm:w-64"
                    />
                  </div>
                  <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {filteredDetailItems.map((item) => {
                      const count = detailCounts[item.id] ?? 0;
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 border border-theme-surface bg-theme-dark/80 p-3 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                            <p>
                              {item.value} cr · {item.slots} slots · {Math.round(item.density)} /slot
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleDetailCountChange(item.id, (detailCounts[item.id] ?? 0) - 1)
                              }
                              className="h-8 w-8 border border-theme-surface text-lg font-bold text-gray-200 hover:border-theme-hazard"
                              aria-label={`Remove ${item.name}`}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={count}
                              onChange={(event) =>
                                handleDetailCountChange(item.id, Number(event.target.value))
                              }
                              className="w-16 bg-theme-dark border-theme-surface text-center text-sm text-gray-100 focus:border-theme-hazard focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleDetailCountChange(item.id, (detailCounts[item.id] ?? 0) + 1)
                              }
                              className="h-8 w-8 border border-theme-surface text-lg font-bold text-gray-200 hover:border-theme-hazard"
                              aria-label={`Add ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {filteredDetailItems.length === 0 && (
                      <p className="text-center text-xs text-gray-600">
                        No items match that search.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <details
            className="group border border-dashed border-gray-700 p-4 bg-black/20"
            open={advancedOpen}
            onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-gray-400 uppercase tracking-wider hover:text-gray-200">
              Optional modifiers / 高级设置
              <span className="text-xs text-theme-hazard">
                {advancedOpen ? "Hide" : "Show"}
              </span>
            </summary>
            <div className="mt-4 space-y-4 text-sm">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-gray-500 uppercase">
                  Time left before vote / 剩余时间
                </span>
                <div className="space-y-2">
                  {timeOptions.map(({ label, value }) => {
                    const active = form.timeLeftTier === value;
                    return (
                      <button
                        type="button"
                        key={value ?? "none"}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            timeLeftTier: prev.timeLeftTier === value ? null : value,
                          }))
                        }
                        className={`w-full border px-3 py-2 text-left text-sm transition font-mono ${active
                            ? "border-theme-hazard bg-theme-hazard/10 text-theme-hazard"
                            : "border-theme-surface bg-theme-dark text-gray-500 hover:border-gray-600"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-gray-500 uppercase">
                  Risk appetite / 风险偏好
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {preferences.map(({ label, value }) => {
                    const active = form.riskPreference === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            riskPreference: value,
                          }))
                        }
                        className={`border px-3 py-2 text-sm font-bold transition uppercase ${active
                            ? "border-green-500 bg-green-500/10 text-green-500"
                            : "border-theme-surface bg-theme-dark text-gray-500 hover:border-gray-600"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </label>
            </div>
          </details>

          <button
            type="submit"
            disabled={!isReady}
            className="mt-6 w-full bg-theme-blood py-4 text-xl font-creepster tracking-widest text-black transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600 shadow-[0_0_15px_rgba(211,47,47,0.4)] hover:shadow-[0_0_25px_rgba(211,47,47,0.6)]"
          >
            Calculate Decision
          </button>
          {!isReady && (
            <p className="mt-2 text-center text-xs text-gray-500 font-mono">
              Enter floor, squad size, and backpack total to unlock the result.
            </p>
          )}
        </form>

        <div className="space-y-6">
          {result ? (
            <article
              className={`border-2 p-6 shadow-2xl relative overflow-hidden ${toneColors[result.tone]}`}
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

              <div className="relative z-10">
                <p className="text-sm uppercase tracking-widest font-bold opacity-80 border-b border-current pb-2 mb-4">
                  Verdict
                </p>
                <h2 className="text-4xl font-creepster tracking-wider mb-2">{result.decisionTitle}</h2>
                <p className="text-sm font-mono opacity-90">{result.reasoning}</p>

                <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="border border-current/30 bg-black/20 p-4">
                    <dt className="text-xs uppercase tracking-wide opacity-70 mb-1">
                      Death probability
                    </dt>
                    <dd className="text-3xl font-mono font-bold">
                      {(result.deathProb * 100).toFixed(0)}%
                    </dd>
                    <p className="text-xs opacity-70 uppercase mt-1">{result.dangerLabel} risk</p>
                  </div>
                  <div className="border border-current/30 bg-black/20 p-4">
                    <dt className="text-xs uppercase tracking-wide opacity-70 mb-1">
                      Expected next-floor loot
                    </dt>
                    <dd className="text-3xl font-mono font-bold">
                      {result.estimatedGain.toLocaleString()} cr
                    </dd>
                    <p className="text-xs opacity-70 mt-1 font-mono">
                      EV stay {result.evStay.toLocaleString()} → go {result.evGo.toLocaleString()}
                    </p>
                  </div>
                </dl>

                <div className="mt-6 border-t border-current/30 pt-4 text-sm font-mono">
                  <p>
                    EV delta: {result.diff >= 0 ? "+" : "-"}
                    {Math.abs(result.diff).toFixed(0)} cr ({(result.diffRatio * 100).toFixed(1)}%)
                  </p>
                </div>

                {result.notes.length > 0 && (
                  <div className="mt-6 space-y-2 text-sm font-mono opacity-80">
                    {result.notes.map((note) => (
                      <p key={note} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        <span>{note}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ) : (
            <article className="border-2 border-dashed border-gray-700 bg-theme-surface/30 p-6 text-gray-500">
              <h2 className="text-2xl font-creepster tracking-wider text-gray-400">Awaiting Input...</h2>
              <p className="mt-4 text-sm font-mono">
                As soon as you hit "Calculate" we&apos;ll simulate the next floor&apos;s EV, survival odds, and
                remind you if the team is already ahead of a typical loot curve.
              </p>
              <p className="mt-4 text-sm font-mono">
                Tip: screenshot this result after each vote to compare against your actual outcomes. That&apos;s
                how we tune the model later.
              </p>
            </article>
          )}

          <div className="border border-theme-surface bg-theme-dark p-4 text-xs text-gray-600 font-mono">
            <p className="font-bold text-gray-500 mb-1 uppercase">Disclaimer</p>
            <p>
              This helper uses community-estimated numbers, not official data. Treat the verdict as a calm
              teammate suggestion, not gospel. Send feedback via the roadmap doc.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
