import Link from "next/link";
import { DiscordPresence } from "@/components/discord-presence";
import { SiteCommand } from "@/components/site-command";
import { MainNav, MobileNav } from "@/components/site-nav";
import { Strand } from "@/components/strand";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export function SiteHeader() {
  const posts = getPosts();

  return (
    <header className="site-header relative z-20">
      <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-3 sm:px-6">
        <Link
          href="/"
          className="rounded-sm font-mono text-phosphor outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-phosphor"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-3 lg:gap-6">
          <MainNav />
          <SiteCommand
            posts={posts.map(({ slug, title, tags }) => ({ slug, title, tags }))}
          />
          <div className="max-md:hidden">
            <DiscordPresence />
          </div>
          <MobileNav />
        </div>
      </div>
      <Strand note={220} className="-my-10" />
    </header>
  );
}
