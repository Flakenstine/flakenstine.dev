import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { c as cn, R as Route } from "./router-BXAGOT0O.js";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { P as PageTransition } from "./page-transition-C__CvafW.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "vaul";
import "@radix-ui/react-separator";
import "sonner";
import "fs";
import "path";
import "remark";
import "remark-html";
function Card({
  children,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className: `rounded-lg bg-gray-800 p-4 shadow-md ${className}`, children });
}
function CardHeader({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "mb-2", children });
}
function CardTitle({ children }) {
  return /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children });
}
function CardDescription({ children }) {
  return /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children });
}
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const MinimalCard = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-[24px] bg-neutral-50 p-2 no-underline shadow-xs transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800/80",
      "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)]",
      "shadow-[rgba(17,24,28,0.08)_0_0_0_1px,rgba(17,24,28,0.08)_0_1px_2px_-1px,rgba(17,24,28,0.04)_0_2px_4px]",
      "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]",
      className
    ),
    ...props,
    children
  }
));
MinimalCard.displayName = "MinimalCard";
const MinimalCardImage = React.forwardRef(({ className, alt, src, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    ref,
    className: cn(
      "relative mb-6 h-[190px] w-full rounded-[20px]",
      "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)]",
      "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt,
          className: "absolute inset-0 h-full w-full rounded-[16px] object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 rounded-[16px]", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute inset-0 rounded-[16px]",
              "shadow-[0px_0px_0px_1px_rgba(0,0,0,.07),0px_0px_0px_3px_#fff,0px_0px_0px_4px_rgba(0,0,0,.08)]",
              "dark:shadow-[0px_0px_0px_1px_rgba(0,0,0,.07),0px_0px_0px_3px_rgba(100,100,100,0.3),0px_0px_0px_4px_rgba(0,0,0,.08)]"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute inset-0 rounded-[16px]",
              "dark:shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15),0px_1px_1px_0px_rgba(0,0,0,0.15)_inset,0px_0px_0px_1px_rgba(0,0,0,0.15)_inset,0px_0px_1px_0px_rgba(0,0,0,0.15)]"
            )
          }
        )
      ] })
    ]
  }
));
MinimalCardImage.displayName = "MinimalCardImage";
const MinimalCardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn("mt-2 px-1 text-lg font-semibold leading-tight", className),
    ...props
  }
));
MinimalCardTitle.displayName = "MinimalCardTitle";
const MinimalCardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("px-1 pb-2 text-sm text-neutral-500", className),
    ...props
  }
));
MinimalCardDescription.displayName = "MinimalCardDescription";
const MinimalCardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
MinimalCardContent.displayName = "MinimalCardContent";
const MinimalCardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
MinimalCardFooter.displayName = "MinimalCardFooter";
function BlogCard({
  title,
  description,
  image,
  slug,
  date
}) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "rounded-lg bg-transparent p-4 shadow-md",
      whileHover: { scale: 1.05, rotate: -1 },
      whileTap: { scale: 0.95, rotate: -1 },
      transition: { type: "spring", stiffness: 300 },
      children: /* @__PURE__ */ jsx(Link, { to: "/blog/$slug", params: { slug }, children: /* @__PURE__ */ jsxs(MinimalCard, { children: [
        /* @__PURE__ */ jsx(MinimalCardImage, { src: image, alt: title }),
        /* @__PURE__ */ jsx(MinimalCardTitle, { className: "text-gray-800", children: title }),
        /* @__PURE__ */ jsx(MinimalCardDescription, { children: /* @__PURE__ */ jsx("p", { children: description }) }),
        /* @__PURE__ */ jsx(MinimalCardFooter, { children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
          "Published on ",
          date.toString()
        ] }) })
      ] }) })
    }
  );
}
function BlogPage() {
  const {
    posts
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-4 py-16", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-8 text-center text-3xl font-bold", children: "flakenstine.dev | Blog" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: posts.length > 0 ? posts.map((post) => /* @__PURE__ */ jsx(BlogCard, { title: post.title, description: post.description, image: post.image, slug: post.slug, date: post.date }, post.slug)) : /* @__PURE__ */ jsx(Card, { className: "col-span-1 text-center sm:col-span-2 lg:col-span-3", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "No Blog Posts Available" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "It seems there are no blog posts at the moment. Please check back later!" })
    ] }) }) })
  ] }) });
}
export {
  BlogPage as component
};
