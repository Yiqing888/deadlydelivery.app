"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "./logo";

const navLinks = [
  { href: "/", label: "Calculator" },
  { href: "/items", label: "Items" },
  { href: "/monsters", label: "Monsters" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center gap-4 rounded-2xl bg-white/90 px-4 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="flex flex-1 items-center gap-4">
            <Logo />
            <nav className="hidden items-center gap-2 text-sm font-semibold text-gray-500 sm:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl px-3 py-1.5 transition ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <nav className="flex flex-1 items-center gap-1 text-xs font-semibold text-gray-500 sm:hidden">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-2 py-1 transition ${
                      active ? "bg-gray-900 text-white" : "text-gray-600"
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
              href="/items"
              className="btn-sm hidden bg-gray-900 text-gray-50 hover:bg-gray-800 sm:inline-flex"
            >
              Loot table
            </Link>
            <Link
              href="/monsters"
              className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Monster deck
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
