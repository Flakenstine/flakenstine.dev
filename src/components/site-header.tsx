import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import MobileNav from "@/components/mobile-nav";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  return (
    <>
      <header className="flex w-full items-center justify-between p-4">
        <Link href="/" className="text-[#00FF9D]">
          flakenstine.dev
        </Link>
        <MainNav />
        <MobileNav />
      </header>
      <Separator className="bg-transparent bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent opacity-25 dark:opacity-100" />
    </>
  );
}
