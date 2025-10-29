/// <reference types="vite/client" />

import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import appCss from "@/styles/globals.css?url"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "flakenstine.dev | website guy" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
    <body className="min-h-screen bg-black font-sans text-white">
      {/* <SiteHeader /> */}
      <Outlet />
      {/* <SiteFooter /> */}
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
      <Scripts />
    </body>
  </html>
  )
}