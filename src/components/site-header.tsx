import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import MobileNav from "@/components/mobile-nav";

export function SiteHeader() {
  return (
    <header className="flex w-full items-center justify-between p-4">
      <Link href="/" className="text-[#00FF9D]">
        flakenstine.dev
      </Link>
      <MainNav />
      <MobileNav />
    </header>
  );
}
