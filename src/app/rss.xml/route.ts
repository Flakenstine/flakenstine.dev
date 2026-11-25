import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[
        char
      ]!,
  );

export function GET() {
  const items = getPosts().map((post) => {
    const link = `${site.url}/blog/${post.slug}`;
    return `<item><title>${escape(post.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escape(post.description)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate>${post.tags.map((tag) => `<category>${escape(tag)}</category>`).join("")}</item>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${site.name}</title><description>${escape(site.description)}</description><link>${site.url}</link><language>en-us</language>${items.join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
