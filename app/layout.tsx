import type { Metadata } from "next";

import "./css/style.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Deadly Delivery Run Planner",
    template: "%s | Deadly Delivery Run Planner",
  },
  description:
    "Community-built profit calculator, loot table, and monster reference for Deadly Delivery players.",
  openGraph: {
    title: "Deadly Delivery Run Planner",
    description:
      "Run-by-run helper with EV calculator plus quick links to loot prices and monster counters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
