"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "./logo";

const navLinks = [
  { href: "/", label: "Calculator" },
  { href: "/items", label: "Items" },
  { href: "/monsters", label: "Monsters" },
  { href: "/classes", label: "Classes" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-30 w-full">
      {/* Hazard Tape Border */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,var(--color-theme-hazard),var(--color-theme-hazard)_10px,#000_10px,#000_20px)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative mt-4 flex h-14 items-center gap-4 rounded-none border border-theme-surface bg-theme-dark/95 px-4 shadow-lg backdrop-blur-sm">
          <div className="flex flex-1 items-center gap-4">
            <Logo />
            <nav className="hidden items-center gap-2 text-sm font-bold text-gray-400 sm:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 transition uppercase tracking-widest ${active
                        ? "text-theme-blood"
                        : "text-gray-500 hover:text-theme-hazard"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <nav className="flex flex-1 items-center gap-1 text-xs font-bold text-gray-500 sm:hidden">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2 py-1 transition uppercase ${active ? "text-theme-blood" : "text-gray-500"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 text-sm">
            <Link
              href="/classes"
              className="hidden border border-theme-surface bg-theme-surface px-3 py-1 text-gray-300 hover:bg-gray-800 sm:inline-flex uppercase tracking-wider text-xs"
            >
              Class planner
            </Link>
            <Link
              href="/roadmap"
              className="border border-theme-blood bg-transparent px-3 py-1 text-theme-blood hover:bg-theme-blood hover:text-white uppercase tracking-wider text-xs transition-colors"
            >
              10-run plan
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
