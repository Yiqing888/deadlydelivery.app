import type { Monster } from "@/data/monsters";

const dangerTone: Record<Monster["dangerLevel"], string> = {
  1: "bg-green-500/10 text-green-500 border-green-500",
  2: "bg-theme-hazard/10 text-theme-hazard border-theme-hazard",
  3: "bg-theme-blood/10 text-theme-blood border-theme-blood",
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
        <article key={monster.id} className="rounded-sm border-2 border-theme-surface bg-theme-dark p-5 shadow-lg relative overflow-hidden group hover:border-theme-hazard transition-colors">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div>
              <h3 className="text-xl font-creepster tracking-wider text-gray-200 group-hover:text-theme-hazard transition-colors">{monster.name}</h3>
              {monster.nickname && (
                <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">{monster.nickname}</p>
              )}
            </div>
            <span className={`rounded-sm border px-3 py-1 text-xs font-bold uppercase tracking-wide ${dangerTone[monster.dangerLevel]}`}>
              {dangerText[monster.dangerLevel]} danger
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500 font-mono relative z-10">
            Floors {monster.floors?.join(", ") ?? "?"}
          </p>
          <p className="mt-3 text-sm text-gray-400 font-mono relative z-10">{monster.descriptionShort}</p>
          <div className="mt-4 space-y-2 text-sm font-mono relative z-10">
            <p>
              <span className="font-bold text-gray-300 uppercase text-xs mr-2">Attack:</span> {monster.attackPattern}
            </p>
            <p>
              <span className="font-bold text-gray-300 uppercase text-xs mr-2">Counter:</span> {monster.counterStrategy}
            </p>
            {monster.notes && <p className="text-xs text-gray-600 italic">{monster.notes}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
