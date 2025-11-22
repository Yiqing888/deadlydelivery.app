"use client";

import { useMemo, useState } from "react";

import type { Item, ItemCategory } from "@/data/items";

interface Props {
  data: Item[];
}

type SortKey = "density" | "value" | "slots" | "name";

const categoryFilters: (ItemCategory | "ALL")[] = [
  "ALL",
  "Food",
  "Drink",
  "Special",
  "Medical",
  "Other",
];

export default function ItemsTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("density");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ItemCategory | "ALL">("ALL");

  const processed = useMemo(() => {
    return data
      .map((item) => ({
        ...item,
        density: item.value / (item.slots || 1),
      }))
      .filter((item) => {
        const matchCategory = category === "ALL" || item.category === category;
        const normalizedSearch = search.trim().toLowerCase();
        const matchSearch =
          normalizedSearch.length === 0 ||
          item.name.toLowerCase().includes(normalizedSearch) ||
          item.alias?.some((alias) => alias.toLowerCase().includes(normalizedSearch));
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        switch (sortKey) {
          case "value":
            return (a.value - b.value) * dir;
          case "slots":
            return (a.slots - b.slots) * dir;
          case "name":
            return a.name.localeCompare(b.name) * dir;
          default:
            return (a.density - b.density) * dir;
        }
      });
  }, [data, category, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "name" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-sm border-2 border-theme-surface bg-theme-surface/30 p-6 shadow-lg backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
        <label className="flex-1 text-sm">
          <span className="mb-2 block font-bold text-gray-400 uppercase tracking-wider">Search loot</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Old Wine, Soul Jam, ..."
            className="w-full bg-theme-dark border-theme-surface text-gray-200 focus:border-theme-hazard focus:ring-0 rounded-sm placeholder-gray-700 font-mono"
          />
        </label>
        <label className="text-sm">
          <span className="mb-2 block font-bold text-gray-400 uppercase tracking-wider">Category</span>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((filter) => {
              const active = filter === category;
              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setCategory(filter)}
                  className={`border px-3 py-2 text-xs font-bold transition uppercase ${active
                      ? "border-theme-hazard bg-theme-hazard/20 text-theme-hazard"
                      : "border-theme-surface bg-theme-dark text-gray-500 hover:border-gray-500"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </label>
      </div>

      <div className="overflow-hidden rounded-sm border-2 border-theme-surface bg-theme-dark shadow-lg">
        <table className="min-w-full divide-y divide-theme-surface text-sm">
          <thead className="bg-theme-surface/50">
            <tr>
              <SortableHeader
                label="Item"
                active={sortKey === "name"}
                direction={sortDir}
                onClick={() => toggleSort("name")}
              />
              <SortableHeader
                label="Value"
                active={sortKey === "value"}
                direction={sortDir}
                onClick={() => toggleSort("value")}
              />
              <SortableHeader
                label="Slots"
                active={sortKey === "slots"}
                direction={sortDir}
                onClick={() => toggleSort("slots")}
              />
              <SortableHeader
                label="Value / slot"
                active={sortKey === "density"}
                direction={sortDir}
                onClick={() => toggleSort("density")}
              />
              <th className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-surface">
            {processed.map((item) => (
              <tr key={item.id} className="text-gray-300 hover:bg-theme-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <p className="font-bold text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-600 font-mono">
                    {item.category} · Floors {item.floors?.join(", ") ?? "?"}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono text-base text-theme-hazard">{item.value.toLocaleString()}</td>
                <td className="px-3 py-3 font-mono">{item.slots}</td>
                <td className="px-3 py-3 font-mono text-base font-bold">
                  {Math.round((item.density ?? 0) * 10) / 10}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 font-mono">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {processed.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500 font-mono">
            No items match that filter. Try clearing search or switching category.
          </p>
        )}
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick(): void;
}) {
  return (
    <th
      scope="col"
      className="cursor-pointer px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-gray-300 transition-colors"
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span aria-hidden className="text-[10px] text-theme-hazard">
            {direction === "asc" ? "▲" : "▼"}
          </span>
        )}
      </span>
    </th>
  );
}
