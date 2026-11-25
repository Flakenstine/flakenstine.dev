import type { MetadataRoute } from "next";
import { getPosts, getTags } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: site.url },
    { url: `${site.url}/blog` },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    ...getTags(posts).map((tag) => ({ url: `${site.url}/blog/tags/${tag}` })),
  ];
}
