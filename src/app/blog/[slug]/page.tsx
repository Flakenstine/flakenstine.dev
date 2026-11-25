import type { Metadata } from "next";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Page } from "@/components/page";
import { PostBody } from "@/components/post-body";
import { PostCover } from "@/components/post-cover";
import { PostToc } from "@/components/post-toc";
import { Tags } from "@/components/tags";
import { formatPostDate, getPost, getPosts, type Post } from "@/lib/posts";
import { site } from "@/lib/site";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const found = getPost((await params).slug);
  if (!found) return {};
  const { title, description, date, author, tags, cover } = found.post;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description,
      url: "./",
      publishedTime: new Date(date).toISOString(),
      authors: [author],
      tags,
      images: cover && [{ url: cover.src, width: cover.width, height: cover.height }],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) notFound();
  const { post, newer, older } = found;

  // Build headings from Velite's toc
  const headings = (post.toc ?? []).map((entry) => ({
    id: slugify(entry.title),
    text: entry.title,
  }));

  return (
    <Page className="section max-w-6xl">
      <div className="read-progress" aria-hidden="true" />
      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          image: post.cover && `${site.url}${post.cover.src}`,
          datePublished: new Date(post.date).toISOString(),
          keywords: post.tags.join(", "),
          author: { "@type": "Person", name: post.author, url: site.url },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${slug}` },
        }}
      />
      <header className="mx-auto max-w-3xl">
        <Link href="/blog" className="link inline-flex items-center gap-2 text-sm">
          <MoveLeftIcon className="size-4" aria-hidden="true" />
          Back to Blog
        </Link>
        <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 font-mono text-sm text-muted">
          by {post.author}, <time dateTime={new Date(post.date).toISOString()}>{formatPostDate(post.date)}</time>,{" "}
          {post.metadata.readingTime} min read
        </p>
        <Tags tags={post.tags} className="mt-5" />
      </header>
      {post.cover && (
        <PostCover
          image={post.cover}
          slug={slug}
          sizes="(min-width: 1024px) 60rem, 100vw"
          preload
          className="mx-auto mt-10 aspect-video max-w-4xl rounded-2xl"
        />
      )}
      <div className="mt-12 grid justify-center gap-12 xl:grid-cols-[14rem_minmax(0,44rem)_14rem]">
        <aside className="max-xl:hidden">
          {headings.length > 1 && (
            <div className="sticky top-12">
              <PostToc headings={headings} />
            </div>
          )}
        </aside>
        <article className="prose-flak prose prose-invert min-w-0 max-w-none">
          <PostBody code={post.body} />
        </article>
      </div>
      {(newer || older) && (
        <nav aria-label="More posts" className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
          {newer ? <Neighbor post={newer} label="Newer" /> : <span className="max-sm:hidden" />}
          {older && <Neighbor post={older} label="Older" end />}
        </nav>
      )}
    </Page>
  );
}

function Neighbor({ post, label, end }: { post: Post; label: string; end?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group rounded-xl border border-line p-5 transition-colors outline-none hover:border-phosphor/60 focus-visible:outline-2 focus-visible:outline-phosphor",
        end && "sm:text-right",
      )}
    >
      <span className={cn("flex items-center gap-2 font-mono text-xs text-muted", end && "sm:justify-end")}>
        {!end && <MoveLeftIcon className="size-3" aria-hidden="true" />}
        {label}
        {end && <MoveRightIcon className="size-3" aria-hidden="true" />}
      </span>
      <span className="mt-2 block font-semibold transition-colors group-hover:text-phosphor">
        {post.title}
      </span>
    </Link>
  );
}
