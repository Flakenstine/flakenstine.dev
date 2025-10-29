import { jsx } from "react/jsx-runtime";
import { motion } from "motion/react";
const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 }
};
function PageTransition({
  children
}) {
  return /* @__PURE__ */ jsx(
    motion.main,
    {
      variants,
      initial: "hidden",
      animate: "enter",
      exit: "exit",
      transition: { type: "linear", duration: 0.5 },
      className: "container mx-auto px-4 py-16",
      children
    }
  );
}
export {
  PageTransition as P
};
