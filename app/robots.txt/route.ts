import { siteMetadata } from "@/lib/seo";

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${siteMetadata.siteUrl}sitemap.xml
`.trim();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
