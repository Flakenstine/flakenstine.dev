import "@/styles/globals.css";
import { IBM_Plex_Mono } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

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
      <body>
        {children}
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
      </body>
    </html>
  );
}
