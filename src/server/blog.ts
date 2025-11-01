import { createServerFn } from "@tanstack/react-start";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import type { Plugin } from "unified";

export type BlogPostMetadata = {
  title: string;
  date: string;
  description: string;
  slug: string;
  image: string;
};

export type BlogPost = {
  title: string;
  date: string;
  author: string;
  content: string;
  readingTime: number;
};

function parseMarkdownMetadata(content: string) {
  const lines = content.split("\n");
  const metadata: Record<string, string> = {};
  let inFrontMatter = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      continue;
    }

    if (inFrontMatter) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
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

function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const metadata: Record<string, string> = {};
  let body = "";
  let inFrontMatter = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      if (!inFrontMatter) body = "";
      continue;
    }

    if (inFrontMatter) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        value = value.replace(/^["'](.*)["']$/, "$1");
        if (key && value) {
          metadata[key] = value;
        }
      }
    } else if (line.trim() !== "---") {
      body += line + "\n";
    }
  }

  return {
    title: metadata.title ?? "Untitled",
    date: metadata.date ?? "",
    author: metadata.author ?? "Unknown",
    body: body.trim(),
  };
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

export const getAllPosts = createServerFn().handler(async () => {
  const postsDirectory = path.join(process.cwd(), "posts");

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { title, date, description, image } =
        parseMarkdownMetadata(fileContents);

      return {
        title,
        date,
        description,
        slug: fileName.replace(/\.md$/, ""),
        image,
      };
    });

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
});

export const getPostBySlug = createServerFn()
  .handler(async (ctx: { data: string }) => {
    try {
      const slug = ctx.data;
      const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);

      if (!fs.existsSync(fullPath)) {
        return null;
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

      return {
        title,
        date,
        author,
        content,
        readingTime,
      };
    } catch (error) {
      console.error("Error loading blog post:", error);
      return null;
    }
  });
