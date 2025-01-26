import fs from "fs";
import path from "path";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BlogCard } from "@/components/blog-card";
import { type Metadata } from "next";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: "flakenstine.dev | Blog",
  description:
    "Welcome to my blog! Here you can find my latest thoughts and ideas.",
};

export default async function BlogPage() {
  const postsDirectory = path.join(process.cwd(), "posts");

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { title, date, description, slug, image } =
        parseMarkdownMetadata(fileContents);

      return {
        title,
        date,
        description,
        slug: fileName.replace(/\.md$/, ""),
        image,
      };
    });

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
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">flakenstine.dev | Blog</h1>
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Blog Posts Available</CardTitle>
            <CardDescription>
              It seems there are no blog posts at the moment. Please check back
              later!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

function parseMarkdownMetadata(content: string) {
  const lines = content.split("\n");
  const metadata: Record<string, string> = {};
  let inFrontMatter = false;

  for (const line of lines) {
    // Handle front matter boundaries
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      continue;
    }

    // Only parse lines within front matter
    if (inFrontMatter) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        // Remove quotes if they exist
        value = value.replace(/^["'](.*)["']$/, "$1");
        if (key && value) {
          metadata[key] = value;
        }
      }
    }
  }

  return {
    title: metadata.title ?? "Untitled",
    date: metadata.date ?? "",
    description: metadata.description ?? "",
    slug: metadata.slug ?? "",
    image: metadata.image ?? "",
  };
}
