import Link from "next/link";
import Logo from "./logo";

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`grid gap-10 py-10 sm:grid-cols-12 ${border ? "border-t [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1]" : ""}`}
        >
          <div className="space-y-3 sm:col-span-12 md:col-span-4">
            <Logo />
            <p className="text-sm text-gray-600">
              Deadly Delivery Run Planner is a community-maintained helper for quick EV checks, loot value,
              and monster reminders. Not affiliated with Roblox or the DD dev team.
            </p>
          </div>

          <div className="space-y-2 text-sm sm:col-span-4">
            <h3 className="font-semibold text-gray-900">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-600 transition hover:text-gray-900" href="/">
                  Profit calculator
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 transition hover:text-gray-900" href="/items">
                  Items table
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 transition hover:text-gray-900" href="/monsters">
                  Monster desk
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-sm sm:col-span-4">
            <h3 className="font-semibold text-gray-900">Data care</h3>
            <p className="text-gray-600">
              Numbers pulled from Bloxinformer, in-game Album, and squad spreadsheets. Spot a wrong value?
              DM <span className="font-mono text-gray-800">@run-planner</span>.
            </p>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Deadly Delivery Run Planner
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
