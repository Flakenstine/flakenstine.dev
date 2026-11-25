import Image from "next/image";
import { ViewTransition } from "react";
import type { ImageInfo } from "@/lib/posts";
import { cn } from "@/lib/utils";

type PostCoverProps = {
  image: ImageInfo;
  slug: string;
  sizes: string;
  /** Shown in the site's phosphor until its card is hovered. */
  tinted?: boolean;
  preload?: boolean;
  className?: string;
};

/** A post's picture. It travels from its card to the post and back. */
export function PostCover({
  image,
  slug,
  sizes,
  tinted,
  preload,
  className,
}: PostCoverProps) {
  return (
    <ViewTransition name={`cover-${slug}`} share="cover" default="none">
      <div className={cn("cover", className)} data-tinted={tinted || undefined}>
        <Image
          src={image.src}
          alt=""
          fill
          sizes={sizes}
          preload={preload}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
      </div>
    </ViewTransition>
  );
}
