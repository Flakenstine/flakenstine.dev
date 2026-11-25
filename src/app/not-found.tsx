import type { Metadata } from "next";
import Link from "next/link";
import { GlyphStage } from "@/components/glyph-stage";
import { Page } from "@/components/page";
import { button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404",
  description: "This page wandered off into the digital landscape.",
};

export default function NotFound() {
  return (
    <Page className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16 text-center">
      <GlyphStage
        source={{ text: "404", rows: 46 }}
        label="Shock the 404"
        className="aspect-[2.35] w-[min(34rem,82vw)]"
      >
        <span className="font-mono text-8xl font-bold text-phosphor">404</span>
      </GlyphStage>
      <h1 className="mt-6 text-2xl font-bold md:text-4xl">This page wandered off.</h1>
      <p className="max-w-md font-mono text-balance text-muted">
        Either it never existed, or it is off roaming Azeroth somewhere.
        Let&apos;s get you back on the map.
      </p>
      <div className="relative flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className={button("solid")}>Go home</Link>
        <Link href="/blog" className={button("outline")}>Read the blog</Link>
      </div>
    </Page>
  );
}
