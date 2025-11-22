import ItemsTable from "@/components/items/items-table";
import { items } from "@/data/items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Deadly Delivery Items & Value Density",
  description:
    "Sortable Deadly Delivery loot table with value-per-slot, quick filters, and maintenance notes.",
  canonical: "/items",
  keywords: ["Deadly Delivery loot prices", "Deadly Delivery items list"],
});

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
        <p className="text-sm uppercase tracking-widest text-theme-hazard font-bold">Loot Economy</p>
        <h1 className="text-4xl font-creepster tracking-wider text-theme-blood sm:text-5xl">
          Items & value density table
        </h1>
        <p className="text-base text-gray-400 font-courier">
          Sort by raw credits, slots, or efficiency to see what should stay in the backpack and what gets tossed mid-run.
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-500 font-mono">
            Data refreshed {lastUpdated.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
      </header>

      <ItemsTable data={items} />

      <p className="mt-8 text-xs text-gray-600 font-mono text-center">
        Source: Bloxinformer + in-game Album. Ping @run-planner on Discord for updates or to submit new loot data after a patch.
      </p>
    </section>
  );
}
