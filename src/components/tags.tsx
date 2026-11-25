import Link from "next/link";
import { cn } from "@/lib/utils";

export function Tags({
  tags,
  current,
  className,
}: {
  tags: string[];
  current?: string;
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/blog/tags/${tag}`}
            aria-current={tag === current ? "page" : undefined}
            className="inline-block rounded-full border border-phosphor/30 px-3 py-1 font-mono text-xs text-phosphor transition-colors outline-none hover:bg-phosphor hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phosphor aria-[current=page]:bg-phosphor aria-[current=page]:text-black"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
