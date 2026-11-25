import type { Metadata } from "next";
import { Page } from "@/components/page";
import { PostGrid } from "@/components/post-grid";
import { Tags } from "@/components/tags";
import { getPosts, getTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Welcome to my blog! Here you can find my latest thoughts and ideas.",
};

export default function Blog() {
  const posts = getPosts();

  return (
    <Page className="section max-w-5xl">
      <header className="mb-12 space-y-5">
        <h1 className="page-title">Blog</h1>
        <p className="font-mono text-sm text-muted">
          {posts.length} {posts.length === 1 ? "post" : "posts"}, also on{" "}
          <a href="/rss.xml" className="link">RSS</a>
        </p>
        <Tags tags={getTags(posts)} />
      </header>
      <PostGrid posts={posts} />
    </Page>
  );
}
