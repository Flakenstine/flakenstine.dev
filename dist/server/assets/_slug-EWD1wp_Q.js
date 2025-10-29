import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import { P as PageTransition } from "./page-transition-C__CvafW.js";
import { a as Route } from "./router-BXAGOT0O.js";
import "motion/react";
import "react";
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
function BlogPost() {
  const {
    post
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/blog", className: "mb-8 inline-flex items-center gap-2 text-[#00FF9D] hover:underline", children: [
      /* @__PURE__ */ jsx(MoveLeft, { className: "h-4 w-4" }),
      "Back to Blog"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold", children: post.title }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-center gap-2 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "by ",
          post.author
        ] }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("span", { children: post.date }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxs("span", { children: [
          post.readingTime,
          " minute read"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("article", { className: "prose prose-invert prose-headings:text-white prose-h1:text-6xl prose-h2:text-3xl prose-p:text-gray-300 prose-a:text-[#00FF9D] prose-strong:text-white prose-code:text-white prose-pre:bg-gray-900 prose-blockquote:text-gray-300 prose-blockquote:border-[#00FF9D] prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-lg mx-auto max-w-3xl", dangerouslySetInnerHTML: {
      __html: post.content
    } })
  ] }) });
}
export {
  BlogPost as component
};
