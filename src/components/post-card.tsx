"use client";

import Link from "next/link";
import { useRef } from "react";

type PostCardProps = {
  href: string;
  children: React.ReactNode;
};

/** Tilts toward the pointer, with a glare that follows it. */
export function PostCard({ href, children }: PostCardProps) {
  const card = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={card}
      href={href}
      className="post-card group"
      onPointerMove={(event) => {
        const el = card.current;
        if (!el || event.pointerType !== "mouse") return;
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        el.style.setProperty("--x", x.toFixed(3));
        el.style.setProperty("--y", y.toFixed(3));
      }}
      onPointerLeave={() => {
        card.current?.style.removeProperty("--x");
        card.current?.style.removeProperty("--y");
      }}
    >
      <span className="post-card-body">{children}</span>
    </Link>
  );
}
