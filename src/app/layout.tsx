import "@/styles/globals.css";
import { IBM_Plex_Mono } from "next/font/google";
import { type Metadata } from "next";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Flakenstine",
  description: "I like to make cool websites",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
