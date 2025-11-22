"use client";

import { useMemo, useState } from "react";

import {
  CalculatorInput,
  CalculationResult,
  PlayerClass,
  RiskPreference,
  TimeLeftTier,
  runCalculation,
} from "@/lib/calculator";

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

  const isReady = useMemo(() => {
    return form.currentFloor > 0 && form.alivePlayers > 0 && form.inventoryValue > 0;
  }, [form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isReady) return;
    setResult(runCalculation(form));
  };

  const toneColors: Record<CalculationResult["tone"], string> = {
    danger: "border-red-200 bg-red-50 text-red-900",
    neutral: "border-amber-200 bg-amber-50 text-amber-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-sm uppercase text-blue-600">Sewer Sherpa</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Deadly Delivery Profit & Risk Calculator
        </h1>
        <p className="text-base text-gray-600">
          Plug in your current floor, backpack haul, and squad health. We crunch a quick EV (期望收益)
          check and tell you if it&apos;s smarter to evacuate or go deeper.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
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
                  className="w-full"
                />
                <span className="w-12 text-center text-lg font-semibold">
                  {form.currentFloor}
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-xs font-medium text-gray-500">
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
                    className="mt-1 w-full rounded-2xl border-gray-200 text-base"
                  />
                </label>
                <p className="rounded-2xl border border-dashed border-gray-200 p-3 text-xs text-gray-500">
                  We default to evaluating the very next floor. Adjust if you already planned a deeper
                  push.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
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
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-blue-500 bg-blue-100 text-blue-900"
                          : "border-gray-200 text-gray-600 hover:border-blue-200"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
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
                className="mt-1 w-full rounded-2xl border-gray-200 text-base"
              >
                {classes.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
                Backpack value / 背包总价值 (credits)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.inventoryValue}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    inventoryValue: Number(event.target.value),
                  }))
                }
                placeholder="Estimate from Album"
                className="mt-1 w-full rounded-2xl border-gray-200 text-base"
              />
              <p className="mt-1 text-xs text-gray-500">
                MVP tip: quick mode only. Detailed per-item fill will arrive in v1.1.
              </p>
            </div>
          </div>

          <details
            className="group rounded-2xl border border-dashed border-gray-200 p-4"
            open={advancedOpen}
            onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-800">
              Optional modifiers / 高级设置
              <span className="text-xs text-blue-500">
                {advancedOpen ? "Hide" : "Show"}
              </span>
            </summary>
            <div className="mt-4 space-y-4 text-sm">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
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
                        className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                          active
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 text-gray-600 hover:border-blue-200"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
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
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : "border-gray-200 text-gray-600 hover:border-emerald-200"
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
            className="mt-6 w-full rounded-2xl bg-gray-900 py-3 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Calculate decision
          </button>
          {!isReady && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Enter floor, squad size, and backpack total to unlock the result.
            </p>
          )}
        </form>

        <div className="space-y-6">
          {result ? (
            <article
              className={`rounded-3xl border p-6 shadow-sm ${toneColors[result.tone]}`}
            >
              <p className="text-sm uppercase tracking-wide text-current">
                Verdict
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{result.decisionTitle}</h2>
              <p className="mt-1 text-sm text-current/80">{result.reasoning}</p>

              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-white/50 bg-white/30 p-4 text-gray-900">
                  <dt className="text-xs uppercase tracking-wide text-gray-600">
                    Death probability
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {(result.deathProb * 100).toFixed(0)}%
                  </dd>
                  <p className="text-xs text-gray-600">{result.dangerLabel} risk</p>
                </div>
                <div className="rounded-2xl border border-white/50 bg-white/30 p-4 text-gray-900">
                  <dt className="text-xs uppercase tracking-wide text-gray-600">
                    Expected next-floor loot
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {result.estimatedGain.toLocaleString()} cr
                  </dd>
                  <p className="text-xs text-gray-600">
                    EV stay {result.evStay.toLocaleString()} → go {result.evGo.toLocaleString()}
                  </p>
                </div>
              </dl>

              <div className="mt-4 border-t border-white/50 pt-4 text-sm">
                <p>
                  EV delta: {result.diff >= 0 ? "+" : "-"}
                  {Math.abs(result.diff).toFixed(0)} cr ({(result.diffRatio * 100).toFixed(1)}%)
                </p>
              </div>

              {result.notes.length > 0 && (
                <div className="mt-4 space-y-2 text-sm">
                  {result.notes.map((note) => (
                    <p key={note} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{note}</span>
                    </p>
                  ))}
                </div>
              )}
            </article>
          ) : (
            <article className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-6 text-gray-500">
              <h2 className="text-2xl font-semibold text-gray-800">Need a call?</h2>
              <p className="mt-2 text-sm">
                As soon as you hit "Calculate" we&apos;ll simulate the next floor&apos;s EV, survival odds, and
                remind you if the team is already ahead of a typical loot curve.
              </p>
              <p className="mt-4 text-sm">
                Tip: screenshot this result after each vote to compare against your actual outcomes. That&apos;s
                how we tune the model later.
              </p>
            </article>
          )}

          <div className="rounded-3xl border border-gray-200 bg-white p-4 text-xs text-gray-500">
            <p className="font-semibold text-gray-700">Disclaimer</p>
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
