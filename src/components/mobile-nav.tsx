/* eslint-disable @typescript-eslint/no-base-to-string */
"use client";

import { useCallback, useState } from "react";
import { DrawerTrigger, Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { type LinkProps } from "next/link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen],
  );

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant={"ghost"}
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            <MobileLink href="/" className="text-black">
              Home
            </MobileLink>
            <MobileLink href="/about" className="text-black">
              About
            </MobileLink>
            <MobileLink href="/blog" className="text-black">
              Blog
            </MobileLink>
            <Button variant={"ghost"} className="w-full justify-start">
              <Link href="#">Discord</Link>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();

  // Ensure href is a string
  const hrefString = typeof href === "string" ? href : String(href);

  return (
    <Link
      href={hrefString}
      onClick={() => {
        void router.push(hrefString);
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
