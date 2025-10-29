import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { getPostBySlug } from "@/server/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    return { post };
  },
  component: BlogPost,
  notFoundComponent: () => {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-400 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Link
          to="/blog"
          className="text-[#00FF9D] hover:underline inline-flex items-center gap-2"
        >
          <MoveLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  },
});

function BlogPost() {
  const { post } = Route.useLoaderData();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[#00FF9D] hover:underline"
        >
          <MoveLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>by {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readingTime} minute read</span>
          </div>
        </div>
        <article
          className="prose prose-invert prose-headings:text-white prose-h1:text-6xl prose-h2:text-3xl prose-p:text-gray-300 prose-a:text-[#00FF9D] prose-strong:text-white prose-code:text-white prose-pre:bg-gray-900 prose-blockquote:text-gray-300 prose-blockquote:border-[#00FF9D] prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-lg mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </PageTransition>
  );
}
