"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
  CommandPage,
} from "@ui-sdk/react/command";
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { usePreference } from "@ui-sdk/react/preferences";
import {
  CheckIcon,
  FileTextIcon,
  HomeIcon,
  MessageSquareIcon,
  NewspaperIcon,
  RssIcon,
  SearchIcon,
  SunIcon,
  Volume2Icon,
  VolumeOffIcon,
  ZapIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { socials } from "@/data/brands";
import { phosphor, PHOSPHORS, sound, type Phosphor } from "@/lib/preferences";
import { shock } from "@/lib/shock";

export type PostLink = { slug: string; title: string; tags: string[] };

const pages = [
  { href: "/", label: "Home", icon: HomeIcon, keywords: ["start"] },
  { href: "/blog", label: "Blog", icon: NewspaperIcon, keywords: ["posts", "writing"] },
  { href: "/#chat", label: "Contact", icon: MessageSquareIcon, keywords: ["email", "chat", "message"] },
];

export function SiteCommand({ posts }: { posts: PostLink[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<string[]>([]);
  const glow = usePreference(phosphor).value;
  const noisy = usePreference(sound).value === "on";

  function run(value: string) {
    const [kind, ...rest] = value.split(":");
    const target = rest.join(":");
    if (kind === "page") return;

    if (kind === "go") router.push(target);
    if (kind === "open") window.open(target, "_blank", "noopener");
    if (kind === "phosphor") phosphor.set(target as Phosphor);
    if (kind === "sound") sound.set(noisy ? "off" : "on");
    if (kind === "shock") {
      // The head lives on the home page. Give it time to put itself together.
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => shock(1.1), 350);
      } else {
        router.push("/");
        setTimeout(() => shock(1.1), 3200);
      }
    }
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setStack([]);
      }}
    >
      <DialogTrigger
        shortcut="mod+k"
        aria-label="Search and commands"
        className="inline-flex h-8 items-center gap-2 rounded-md border border-line px-2.5 font-mono text-xs text-muted transition-colors hover:border-phosphor/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phosphor"
      >
        <SearchIcon className="size-4" aria-hidden="true" />
        <DialogShortcut className="max-md:hidden" />
      </DialogTrigger>
      <DialogBackdrop className="backdrop" />
      <DialogContent className="popup palette">
        <DialogTitle className="sr-only">Search and commands</DialogTitle>
        <Command pages={stack} onPagesChange={setStack} onAction={run}>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <span className="font-mono text-phosphor" aria-hidden="true">
              {stack.length ? "phosphor" : "~"} ❯
            </span>
            <CommandInput
              aria-label="Search and commands"
              placeholder={stack.length ? "Pick a glow" : "Where to?"}
              className="h-13 min-w-0 flex-1 bg-transparent font-mono text-base text-ink outline-none placeholder:text-muted"
            />
          </div>
          <CommandEmpty className="text-center font-mono text-sm text-muted data-empty:px-4 data-empty:py-8">
            Nothing by that name.
          </CommandEmpty>
          <CommandList className="max-h-[min(24rem,55svh)] overflow-y-auto p-2">
            <CommandPage>
              <CommandGroup>
                <CommandGroupLabel className="palette-label">Go to</CommandGroupLabel>
                {pages.map(({ href, label, icon: Icon, keywords }) => (
                  <CommandItem key={href} value={`go:${href}`} keywords={keywords} className="palette-item">
                    <CommandItemIcon><Icon /></CommandItemIcon>
                    <CommandItemText>{label}</CommandItemText>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel className="palette-label">Posts</CommandGroupLabel>
                {posts.map((post) => (
                  <CommandItem
                    key={post.slug}
                    value={`go:/blog/${post.slug}`}
                    keywords={post.tags}
                    className="palette-item"
                  >
                    <CommandItemIcon><FileTextIcon /></CommandItemIcon>
                    <CommandItemText className="truncate">{post.title}</CommandItemText>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel className="palette-label">The lab</CommandGroupLabel>
                <CommandItem value="shock:head" keywords={["head", "alive", "lightning"]} className="palette-item">
                  <CommandItemIcon><ZapIcon /></CommandItemIcon>
                  <CommandItemText>Shock the head</CommandItemText>
                </CommandItem>
                <CommandItem value="page:phosphor" page="phosphor" keywords={["theme", "color"]} className="palette-item">
                  <CommandItemIcon><SunIcon /></CommandItemIcon>
                  <CommandItemText>Change the phosphor</CommandItemText>
                </CommandItem>
                <CommandItem value="sound:toggle" keywords={["audio", "mute"]} className="palette-item">
                  <CommandItemIcon>{noisy ? <VolumeOffIcon /> : <Volume2Icon />}</CommandItemIcon>
                  <CommandItemText>{noisy ? "Turn sound off" : "Turn sound on"}</CommandItemText>
                </CommandItem>
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel className="palette-label">Elsewhere</CommandGroupLabel>
                {socials.map((social) => (
                  <CommandItem key={social.name} value={`open:${social.href}`} className="palette-item">
                    <CommandItemIcon><BrandIcon icon={social.icon} /></CommandItemIcon>
                    <CommandItemText>{social.name}</CommandItemText>
                  </CommandItem>
                ))}
                <CommandItem value="open:/rss.xml" keywords={["feed"]} className="palette-item">
                  <CommandItemIcon><RssIcon /></CommandItemIcon>
                  <CommandItemText>RSS</CommandItemText>
                </CommandItem>
              </CommandGroup>
            </CommandPage>
            <CommandPage value="phosphor">
              {PHOSPHORS.map(({ value, label }) => (
                <CommandItem key={value} value={`phosphor:${value}`} className="palette-item">
                  <CommandItemIcon>
                    <span className="swatch" data-phosphor={value} />
                  </CommandItemIcon>
                  <CommandItemText>{label}</CommandItemText>
                  {glow === value && <CheckIcon className="ml-auto size-4" aria-label="Current" />}
                </CommandItem>
              ))}
            </CommandPage>
          </CommandList>
          <p className="hidden gap-4 border-t border-line px-4 py-2.5 font-mono text-xs text-muted sm:flex" aria-hidden="true">
            <span>↑↓ move</span>
            <span>↵ run</span>
            <span>esc {stack.length ? "back" : "close"}</span>
          </p>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
