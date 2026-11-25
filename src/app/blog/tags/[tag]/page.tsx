import type { Metadata } from "next";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/page";
import { PostGrid } from "@/components/post-grid";
import { Tags } from "@/components/tags";
import { getPosts, getTags } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags(getPosts()).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `Posts tagged ${tag} on flakenstine.dev` };
}

export default async function Tag({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;
  const all = getPosts();
  const posts = all.filter((post) => post.tags.includes(tag));
  if (posts.length === 0) notFound();

  return (
    <Page className="section max-w-5xl">
      <header className="mb-12 space-y-5">
        <Link href="/blog" className="link inline-flex items-center gap-2 text-sm">
          <MoveLeftIcon className="size-4" aria-hidden="true" />
          All posts
        </Link>
        <h1 className="page-title">
          <span className="text-phosphor">#</span>
          {tag}
        </h1>
        <Tags tags={getTags(all)} current={tag} />
      </header>
      <PostGrid posts={posts} />
    </Page>
  );
}
