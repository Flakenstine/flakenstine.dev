import { PostCard } from "@/components/post-card";
import { PostCover } from "@/components/post-cover";
import { formatPostDate, type Post } from "@/lib/posts";

export function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-line p-10 text-center font-mono text-muted">
        No posts yet. Check back later!
      </p>
    );
  }

  return (
    <ul className="grid gap-8 md:grid-cols-2">
      {posts.map((post, i) => (
        <li key={post.slug}>
          <PostCard href={`/blog/${post.slug}`}>
            {post.cover && (
              <PostCover
                image={post.cover}
                slug={post.slug}
                sizes="(min-width: 768px) 32rem, 100vw"
                tinted
                preload={i < 2}
                className="aspect-[16/10] rounded-xl"
              />
            )}
            <span className="flex flex-1 flex-col px-2 pt-5 pb-2">
              <span className="font-mono text-xs text-muted">
                {formatPostDate(post.date)}, {post.metadata.readingTime} min read
              </span>
              <h2 className="mt-2 text-xl leading-snug font-bold text-balance transition-colors group-hover:text-phosphor">
                {post.title}
              </h2>
              <span className="mt-2 text-muted">{post.description}</span>
            </span>
          </PostCard>
        </li>
      ))}
    </ul>
  );
}
