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
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-semibold text-gray-800">Search loot</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Old Wine, Soul Jam, ..."
            className="w-full rounded-2xl border-gray-200 text-base"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-gray-800">Category</span>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((filter) => {
              const active = filter === category;
              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setCategory(filter)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 text-gray-600 hover:border-blue-200"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </label>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
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
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processed.map((item) => (
              <tr key={item.id} className="text-gray-900">
                <td className="px-3 py-3">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.category} · Floors {item.floors?.join(", ") ?? "?"}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono text-base">{item.value.toLocaleString()}</td>
                <td className="px-3 py-3">{item.slots}</td>
                <td className="px-3 py-3 font-mono text-base">
                  {Math.round((item.density ?? 0) * 10) / 10}
                </td>
                <td className="px-3 py-3 text-xs text-gray-600">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {processed.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
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
      className="cursor-pointer px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span aria-hidden className="text-[10px]">
            {direction === "asc" ? "▲" : "▼"}
          </span>
        )}
      </span>
    </th>
  );
}
