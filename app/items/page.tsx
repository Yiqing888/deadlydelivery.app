import ItemsTable from "@/components/items/items-table";
import { items } from "@/data/items";

export const metadata = {
  title: "Deadly Delivery Items & Value Density",
  description:
    "Sortable Deadly Delivery loot table with value-per-slot, quick filters, and maintenance notes.",
};

const lastUpdated = items.reduce<Date | null>((latest, item) => {
  if (!item.lastUpdated) return latest;
  const date = new Date(item.lastUpdated);
  if (!latest || date > latest) return date;
  return latest;
}, null);

export default function ItemsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-sm uppercase text-blue-600">Loot Economy</p>
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
          Items & value density table
        </h1>
        <p className="text-base text-gray-600">
          Sort by raw credits, slots, or efficiency to see what should stay in the backpack and what gets tossed mid-run.
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            Data refreshed {lastUpdated.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
      </header>

      <ItemsTable data={items} />

      <p className="mt-8 text-xs text-gray-500">
        Source: Bloxinformer + in-game Album. Ping @run-planner on Discord for updates or to submit new loot data after a patch.
      </p>
    </section>
  );
}
