import type { Monster } from "@/data/monsters";

const dangerTone: Record<Monster["dangerLevel"], string> = {
  1: "bg-emerald-50 text-emerald-700",
  2: "bg-amber-50 text-amber-700",
  3: "bg-red-50 text-red-700",
};

const dangerText: Record<Monster["dangerLevel"], string> = {
  1: "Low",
  2: "High",
  3: "Extreme",
};

export default function MonsterCards({ data }: { data: Monster[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((monster) => (
        <article key={monster.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{monster.name}</h3>
              {monster.nickname && (
                <p className="text-xs uppercase tracking-wide text-gray-500">{monster.nickname}</p>
              )}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dangerTone[monster.dangerLevel]}`}>
              {dangerText[monster.dangerLevel]} danger
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Floors {monster.floors?.join(", ") ?? "?"}
          </p>
          <p className="mt-3 text-sm text-gray-700">{monster.descriptionShort}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-semibold text-gray-900">Attack:</span> {monster.attackPattern}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Counter:</span> {monster.counterStrategy}
            </p>
            {monster.notes && <p className="text-xs text-gray-500">{monster.notes}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
