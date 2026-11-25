import { posts as allPosts } from "@/../.velite";

export type { Post } from "@/../.velite";
export type { Image as ImageInfo } from "velite";

/** Newest first, the order posts are shown everywhere on the site. */
export function getPosts() {
  return allPosts.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
  );
}

export function getPost(slug: string) {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return;
  return {
    post: posts[index],
    newer: posts[index - 1] as (typeof posts)[number] | undefined,
    older: posts[index + 1] as (typeof posts)[number] | undefined,
  };
}

export function getTags(posts: typeof allPosts) {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
