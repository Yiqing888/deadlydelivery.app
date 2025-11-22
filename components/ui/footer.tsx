import Link from "next/link";
import Logo from "./logo";

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className="bg-theme-dark border-t border-theme-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`grid gap-10 py-10 sm:grid-cols-12`}
        >
          <div className="space-y-3 sm:col-span-12 md:col-span-4">
            <Logo />
            <p className="text-sm text-gray-500">
              Deadly Delivery Run Planner is a community-maintained helper for quick EV checks, loot value,
              and monster reminders. Not affiliated with Roblox or the DD dev team.
            </p>
          </div>

          <div className="space-y-2 text-sm sm:col-span-4">
            <h3 className="font-bold text-gray-200 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/">
                  Profit calculator
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/items">
                  Items table
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/monsters">
                  Monster desk
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/classes">
                  Class planner
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/roadmap">
                  Run roadmap
                </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-theme-blood" href="/about">
                  About project
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-sm sm:col-span-4">
            <h3 className="font-bold text-gray-200 uppercase tracking-wider">Data care</h3>
            <p className="text-gray-500">
              Numbers pulled from Bloxinformer, in-game Album, and squad spreadsheets. Spot a wrong value?
              DM <span className="font-mono text-gray-300">@run-planner</span>.
            </p>
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Deadly Delivery Run Planner
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
