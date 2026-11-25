import type { Metadata, Viewport } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import { AppPreferences } from "@/components/app-preferences";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { site } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `${site.name} | %s` },
  description: site.description,
  alternates: {
    canonical: "./",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: site.name }] },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "./",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Flakenstine",
    creator: "@Flakenstine",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${plex.variable}`}
      // The saved phosphor goes on <html> before React arrives.
      suppressHydrationWarning
    >
      <body>
        <AppPreferences>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-phosphor focus:px-4 focus:py-2 focus:font-mono focus:text-black"
          >
            Skip to content
          </a>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
          <Toaster />
        </AppPreferences>
      </body>
    </html>
  );
}
