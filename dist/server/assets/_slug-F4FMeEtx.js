import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
const SplitNotFoundComponent = () => {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Post Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-8", children: "The blog post you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxs(Link, { to: "/blog", className: "text-[#00FF9D] hover:underline inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(MoveLeft, { className: "h-4 w-4" }),
      "Back to Blog"
    ] })
  ] });
};
export {
  SplitNotFoundComponent as notFoundComponent
};
