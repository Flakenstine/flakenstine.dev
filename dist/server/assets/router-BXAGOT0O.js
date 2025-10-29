import { Link, createRootRoute, HeadContent, Outlet, Scripts, createFileRoute, lazyRouteComponent, notFound, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Drawer as Drawer$1 } from "vaul";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { Toaster } from "sonner";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
const appCss = "/assets/globals-n93XkKbo.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
function DiscordStatus({ userId, className = "" }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
          mode: "cors"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Discord status data:", data);
        console.log("Discord status success:", data.success);
        console.log("Discord status value:", data.data?.discord_status);
        setStatus(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch Discord status:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch status");
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3e4);
    return () => clearInterval(interval);
  }, [userId]);
  const getStatusColor = (discordStatus) => {
    switch (discordStatus) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
      default:
        return "bg-gray-500";
    }
  };
  const getStatusText = (discordStatus) => {
    switch (discordStatus) {
      case "online":
        return "Online";
      case "idle":
        return "Away";
      case "dnd":
        return "Do Not Disturb";
      case "offline":
      default:
        return "Offline";
    }
  };
  const getStatusInfo = () => {
    if (loading) {
      return {
        status: "Loading...",
        details: "Fetching Discord status",
        color: "bg-gray-400",
        animate: "animate-pulse"
      };
    }
    if (error || !status?.success) {
      return {
        status: "Unavailable",
        details: error ? `Error: ${error}` : "Discord status unavailable",
        color: "bg-gray-500",
        animate: ""
      };
    }
    const discordStatus = status.data.discord_status;
    const activities = status.data.activities || [];
    const isListeningToSpotify = status.data.listening_to_spotify;
    let statusText = getStatusText(discordStatus);
    let details = `Discord Status: ${statusText}`;
    if (activities.length > 0) {
      const activity = activities[0];
      if (activity && activity.name && activity.details) {
        details += `
Currently: ${activity.name} - ${activity.details}`;
      } else if (activity && activity.name) {
        details += `
Currently: ${activity.name}`;
      }
    }
    if (isListeningToSpotify && status.data.spotify) {
      const spotify = status.data.spotify;
      details += `
🎵 Listening to: ${spotify.song} by ${spotify.artist}`;
    }
    return {
      status: statusText,
      details,
      color: getStatusColor(discordStatus),
      animate: discordStatus === "online" ? "animate-pulse" : ""
    };
  };
  const statusInfo = getStatusInfo();
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: `relative ${className}`, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-3 h-3 rounded-full ${statusInfo.color} ${statusInfo.animate}`
      }
    ) }) }),
    /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: statusInfo.status }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-300 whitespace-pre-line", children: statusInfo.details })
    ] }) })
  ] }) });
}
const navItems = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" }
];
function MainNav() {
  return /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-8 md:flex font-mono", children: [
    navItems.map((item) => /* @__PURE__ */ jsx(
      Link,
      {
        className: "rounded-md px-2 py-1.5 transition-all duration-200 hover:bg-[#00FF9D] font-bold uppercase tracking-wide hover:text-black",
        to: item.href,
        children: item.name
      },
      item.name
    )),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "default",
        size: "sm",
        className: "bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black relative",
        asChild: true,
        children: /* @__PURE__ */ jsxs("a", { href: "https://discordapp.com/users/129471053717176320", target: "_blank", rel: "noopener noreferrer", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              role: "img",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsx("title", { children: "Discord" }),
                /* @__PURE__ */ jsx("path", { d: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" })
              ]
            }
          ),
          "discord",
          /* @__PURE__ */ jsx(DiscordStatus, { userId: "129471053717176320" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Discord" })
        ] })
      }
    )
  ] });
}
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /* @__PURE__ */ jsx(
  Drawer$1.Root,
  {
    shouldScaleBackground,
    ...props
  }
);
Drawer.displayName = "Drawer";
const DrawerTrigger = Drawer$1.Trigger;
const DrawerPortal = Drawer$1.Portal;
Drawer$1.Close;
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Overlay,
  {
    ref,
    className: cn("fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = Drawer$1.Overlay.displayName;
const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DrawerPortal, { children: [
  /* @__PURE__ */ jsx(DrawerOverlay, {}),
  /* @__PURE__ */ jsxs(
    Drawer$1.Content,
    {
      ref,
      className: cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
        children
      ]
    }
  )
] }));
DrawerContent.displayName = "DrawerContent";
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DrawerTitle.displayName = Drawer$1.Title.displayName;
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = Drawer$1.Description.displayName;
function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = useCallback(
    (open) => {
      setIsOpen(open);
    },
    [setIsOpen]
  );
  return /* @__PURE__ */ jsxs(Drawer, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        className: "-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "size-6!",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M3.75 9h16.5m-16.5 6.75h16.5"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Menu" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DrawerContent, { className: "max-h-[60svh] p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-3", children: [
      /* @__PURE__ */ jsx(MobileLink, { to: "/", className: "text-black", children: "Home" }),
      /* @__PURE__ */ jsx(MobileLink, { to: "/blog", className: "text-black", children: "Blog" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "https://discordapp.com/users/129471053717176320",
          className: "inline-flex gap-2 text-black text-base",
          target: "_blank",
          rel: "noopener noreferrer",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "size-6", children: [
              " ",
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  role: "img",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "currentColor",
                  children: [
                    /* @__PURE__ */ jsx("title", { children: "Discord" }),
                    /* @__PURE__ */ jsx("path", { d: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" })
                  ]
                }
              )
            ] }),
            "Discord"
          ]
        }
      )
    ] }) }) })
  ] });
}
function MobileLink({
  to,
  onOpenChange,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      to,
      onClick: () => {
        onOpenChange?.(false);
      },
      className: cn("text-base", className),
      ...props,
      children
    }
  );
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
function SiteHeader() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("header", { className: "flex w-full items-center justify-between p-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-[#00FF9D]", children: "flakenstine.dev" }),
      /* @__PURE__ */ jsx(MainNav, {}),
      /* @__PURE__ */ jsx(MobileNav, {})
    ] }),
    /* @__PURE__ */ jsx(Separator, { className: "bg-transparent bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent opacity-25 dark:opacity-100" })
  ] });
}
const Route$4 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "flakenstine.dev | website guy" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  component: RootLayout
});
function RootLayout() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "min-h-screen bg-black font-sans text-white", children: [
      /* @__PURE__ */ jsx(SiteHeader, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(
        Toaster,
        {
          position: "bottom-right",
          theme: "dark",
          toastOptions: {
            style: {
              background: "#000",
              border: "1px solid #00FF9D",
              color: "#fff"
            }
          }
        }
      ),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$3 = () => import("./test-TAWnWnT1.js");
const Route$3 = createFileRoute("/test")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-ChMA3NG9.js");
const Route$2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function parseMarkdownMetadata(content) {
  const lines = content.split("\n");
  const metadata = {};
  let inFrontMatter = false;
  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      continue;
    }
    if (inFrontMatter) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        value = value.replace(/^["'](.*)["']$/, "$1");
        if (key && value) {
          metadata[key] = value;
        }
      }
    }
  }
  return {
    title: metadata.title ?? "Untitled",
    date: metadata.date ?? "",
    description: metadata.description ?? "",
    slug: metadata.slug ?? "",
    image: metadata.image ?? ""
  };
}
function parseMarkdown(content) {
  const lines = content.split("\n");
  const metadata = {};
  let body = "";
  let inFrontMatter = false;
  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontMatter = !inFrontMatter;
      if (!inFrontMatter) body = "";
      continue;
    }
    if (inFrontMatter) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        value = value.replace(/^["'](.*)["']$/, "$1");
        if (key && value) {
          metadata[key] = value;
        }
      }
    } else if (line.trim() !== "---") {
      body += line + "\n";
    }
  }
  return {
    title: metadata.title ?? "Untitled",
    date: metadata.date ?? "",
    author: metadata.author ?? "Unknown",
    body: body.trim()
  };
}
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}
async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { title, date, description, image } = parseMarkdownMetadata(fileContents);
      return {
        title,
        date,
        description,
        slug: fileName.replace(/\.md$/, ""),
        image
      };
    });
    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}
async function getPostBySlug(slug) {
  try {
    const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { title, date, author, body } = parseMarkdown(fileContents);
    const readingTime = calculateReadingTime(body);
    let content = "";
    if (body) {
      const result = await remark().use(html).process(body);
      content = result.toString();
    }
    return {
      title,
      date,
      author,
      content,
      readingTime
    };
  } catch (error) {
    console.error("Error loading blog post:", error);
    return null;
  }
}
const $$splitComponentImporter$1 = () => import("./index-CSU39_ln.js");
const Route$1 = createFileRoute("/blog/")({
  head: () => ({
    meta: [{
      title: "flakenstine.dev | Blog"
    }, {
      name: "description",
      content: "Welcome to my blog! Here you can find my latest thoughts and ideas."
    }]
  }),
  loader: async () => {
    const posts = await getAllPosts();
    return {
      posts
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitNotFoundComponentImporter = () => import("./_slug-F4FMeEtx.js");
const $$splitComponentImporter = () => import("./_slug-EWD1wp_Q.js");
const Route = createFileRoute("/blog/$slug")({
  loader: async ({
    params
  }) => {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    return {
      post
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const TestRoute = Route$3.update({
  id: "/test",
  path: "/test",
  getParentRoute: () => Route$4
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const BlogIndexRoute = Route$1.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => Route$4
});
const BlogSlugRoute = Route.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  TestRoute,
  BlogSlugRoute,
  BlogIndexRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  Separator as S,
  Route as a,
  cn as c,
  router as r
};
