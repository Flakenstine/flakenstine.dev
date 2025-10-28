import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

import { IBM_Plex_Mono } from "next/font/google";
import { Figtree } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "flakenstine.dev | websibte guy",
  description: "I like to make cool websites",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${figtree.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen bg-black font-sans text-white">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#000",
              border: "1px solid #00FF9D",
              color: "#fff",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
