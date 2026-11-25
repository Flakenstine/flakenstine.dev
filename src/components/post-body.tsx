import Image from "next/image";
import Link from "next/link";
import path from "node:path";
import { isValidElement, type ComponentProps, type ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import sharp from "sharp";
import { slugify } from "@/lib/utils";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return `${node}`;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

/** Size and a tiny preview for an image in `public/`, read at build time. */
async function measure(src: string) {
  const file = sharp(path.join(process.cwd(), "public", src));
  const { width, height } = await file.metadata();
  const tiny = await file.resize(16).webp({ quality: 40 }).toBuffer();
  return {
    width,
    height,
    blur: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
}

const components = {
  h2: ({ children, ...props }: ComponentProps<"h2">) => (
    <h2 {...props} id={slugify(textOf(children))}>
      {children}
    </h2>
  ),
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link {...props} href={href} />
    ) : (
      <a {...props} href={href} />
    ),
  img: async ({ src, alt = "" }: ComponentProps<"img">) => {
    if (typeof src !== "string" || !src.startsWith("/")) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} loading="lazy" decoding="async" />;
    }
    const { width, height, blur } = await measure(src);
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 44rem, 100vw"
        placeholder="blur"
        blurDataURL={blur}
      />
    );
  },
};

type Content = (props: { components: typeof components }) => ReactNode;

/** Renders the function body Velite compiles a post to, on the server. */
export function PostBody({ code }: { code: string }) {
  const { default: content } = new Function(code)(runtime) as {
    default: Content;
  };
  return content({ components });
}
