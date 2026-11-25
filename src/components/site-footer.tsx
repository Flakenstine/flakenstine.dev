import { BrandIcon } from "@/components/brand-icon";
import { SiteControls } from "@/components/site-controls";
import { Strand } from "@/components/strand";
import { tools } from "@/data/brands";
import { site } from "@/lib/site";

const next = tools.find((tool) => tool.name === "Next.js")!;

export function SiteFooter() {
  return (
    <footer className="site-footer relative">
      <Strand note={146.83} className="-my-10" />
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <SiteControls />
        <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-muted">
          Powered by
          <span className="inline-flex items-center gap-1.5 text-phosphor">
            <BrandIcon icon={next.icon} className="size-4" />
            Next.js
          </span>
          <span aria-hidden="true">|</span>
          <span>
            Source available on{" "}
            <a href={site.repo} target="_blank" rel="noopener noreferrer" className="link">
              GitHub
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
