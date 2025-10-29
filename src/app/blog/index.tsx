import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BlogCard } from "@/components/blog-card";
import PageTransition from "@/components/page-transition";
import { getAllPosts } from "@/server/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      {
        title: "flakenstine.dev | Blog",
      },
      {
        name: "description",
        content:
          "Welcome to my blog! Here you can find my latest thoughts and ideas.",
      },
    ],
  }),
  loader: async () => {
    const posts = await getAllPosts();
    return { posts };
  },
  component: BlogPage,
});

function BlogPage() {
  const { posts } = Route.useLoaderData();

  return (
    <PageTransition>
      <main className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold">
          flakenstine.dev | Blog
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                description={post.description}
                image={post.image}
                slug={post.slug}
                date={post.date}
              />
            ))
          ) : (
            <Card className="col-span-1 text-center sm:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>No Blog Posts Available</CardTitle>
                <CardDescription>
                  It seems there are no blog posts at the moment. Please check
                  back later!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
