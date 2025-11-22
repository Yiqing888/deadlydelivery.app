import type { Metadata } from "next";

const SITE_ORIGIN = "https://deadlydelivery.app";
const SITE_URL = `${SITE_ORIGIN}/`;

export const siteMetadata = {
  siteUrl: SITE_URL,
  name: "Deadly Delivery Run Planner",
  shortName: "Deadly Delivery Planner",
  author: "Deadly Delivery community",
  description:
    "Run-by-run profit calculator plus loot prices, monster counters, and build planning tools for Roblox Deadly Delivery players.",
  keywords: [
    "Deadly Delivery",
    "Deadly Delivery Run Planner",
    "Deadly Delivery calculator",
    "Deadly Delivery profit calculator",
    "Deadly Delivery loot table",
    "Deadly Delivery monster guide",
    "Roblox horror game",
    "Roblox Deadly Delivery tools",
    "Deadly Delivery EV",
    "Deadly Delivery strategy",
  ],
  socialImage: "/images/logo.png",
  socialAlt: "Deadly Delivery Run Planner interface preview",
};

export const absoluteUrl = (path: string): string => {
  if (!path || path === "/") return SITE_URL;
  if (path.startsWith("http")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
};

type BuildMetadataParams = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  canonical,
  keywords = [],
}: BuildMetadataParams): Metadata {
  const canonicalUrl = absoluteUrl(canonical);
  const allKeywords = Array.from(new Set([...siteMetadata.keywords, ...keywords]));
  const ogImage = absoluteUrl(siteMetadata.socialImage);

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteMetadata.name,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: siteMetadata.socialAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
