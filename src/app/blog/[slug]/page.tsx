import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import type { Plugin } from "unified";
import { MoveLeft } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

// Function to calculate reading time
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

export default async function BlogPost({ params }: PageProps) {
  if (!params.slug) {
    notFound();
  }

  try {
    const fullPath = path.join(process.cwd(), "posts", `${params.slug}.md`);
    if (!fs.existsSync(fullPath)) {
      notFound();
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { title, date, author, body } = parseMarkdown(fileContents);
    const readingTime = calculateReadingTime(body);

    let content = "";
    if (body) {
      const result = await remark()
        .use(html as Plugin)
        .process(body);
      content = result.toString();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[#00FF9D] hover:underline"
        >
          <MoveLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>by {author}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>{readingTime} minute read</span>
          </div>
        </div>
        <article
          className="prose prose-invert prose-headings:text-white prose-h1:text-6xl prose-h2:text-3xl prose-p:text-gray-300 prose-a:text-[#00FF9D] prose-strong:text-white prose-code:text-white prose-pre:bg-gray-900 prose-blockquote:text-gray-300 prose-blockquote:border-[#00FF9D] prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-lg mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}

function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const metadata: Record<string, string> = {};
  let body = "";
  let inFrontMatter = false;

  for (const line of lines) {
    // Handle front matter boundaries
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      if (!inFrontMatter) body = ""; // Reset body when front matter ends
      continue;
    }

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
    } else if (line.trim() !== "---") {
      body += line + "\n";
    }
  }

  // Add console.log to debug the metadata
  console.log("Parsed Metadata:", metadata);

  return {
    title: metadata.title ?? "Untitled",
    date: metadata.date ?? "",
    author: metadata.author ?? "Unknown",
    body: body.trim(),
  };
}
