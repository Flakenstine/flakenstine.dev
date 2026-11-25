"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/** The post's sections, following along as it is read. */
export function PostToc({ headings }: { headings: Heading[] }) {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const sections = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el) => el !== null);

    const update = () => {
      const line = window.innerHeight * 0.3;
      const passed = sections.filter(
        (el) => el.getBoundingClientRect().top < line,
      );
      setCurrent(passed.at(-1)?.id ?? "");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  return (
    <nav aria-label="In this post">
      <ul className="space-y-1 border-l border-line font-mono text-xs leading-relaxed">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === current ? "location" : undefined}
              className="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition-colors outline-none hover:text-ink focus-visible:text-ink aria-[current]:border-phosphor aria-[current]:text-phosphor"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
