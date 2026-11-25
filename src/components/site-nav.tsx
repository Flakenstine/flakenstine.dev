"use client";

import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { discord } from "@/data/brands";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

function useCurrent() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function MainNav() {
  const isCurrent = useCurrent();

  return (
    <nav aria-label="Main" className="hidden items-center gap-4 font-mono md:flex lg:gap-8">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrent(item.href) ? "page" : undefined}
          className="rounded-md px-2 py-1.5 font-bold tracking-wide uppercase transition-colors duration-200 outline-none hover:bg-phosphor hover:text-black focus-visible:outline-2 focus-visible:outline-phosphor aria-[current=page]:not-hover:text-phosphor"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const isCurrent = useCurrent();
  const row =
    "flex items-center gap-3 rounded-lg px-4 py-3.5 font-mono text-lg outline-none active:bg-phosphor active:text-black focus-visible:outline-2 focus-visible:outline-phosphor";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        aria-label="Menu"
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-phosphor md:hidden"
      >
        <MenuIcon className="size-6" aria-hidden="true" />
      </DrawerTrigger>
      <DrawerBackdrop className="bg-black/70" />
      <DrawerContent className="drawer">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line" aria-hidden="true" />
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <nav aria-label="Main" className="p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(row, "aria-[current=page]:not-active:text-phosphor")}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={discord.href}
            target="_blank"
            rel="noopener noreferrer"
            className={row}
          >
            <BrandIcon icon={discord.icon} className="size-5" />
            Discord
          </a>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
