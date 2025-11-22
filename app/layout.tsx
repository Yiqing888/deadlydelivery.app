import type { Metadata } from "next";

import "./css/style.css";

import { Courier_Prime, Creepster } from "next/font/google";

import { absoluteUrl, siteMetadata } from "@/lib/seo";

const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.name,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  applicationName: siteMetadata.shortName,
  authors: [{ name: siteMetadata.author }],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteMetadata.name,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: absoluteUrl(siteMetadata.socialImage),
        alt: siteMetadata.socialAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.name,
    description: siteMetadata.description,
    images: [absoluteUrl(siteMetadata.socialImage)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
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
        className={`${courier.variable} ${creepster.variable} bg-theme-dark font-courier tracking-tight text-gray-200 antialiased cursor-retro`}
      >
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-crt-flicker"></div>
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
