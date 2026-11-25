import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-mono text-sm font-bold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,scale] duration-200 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phosphor active:scale-[0.98] disabled:opacity-50 data-pending:opacity-70";

const variants = {
  solid:
    "bg-phosphor text-black hover:shadow-[0_0_2rem_-0.25rem_var(--phosphor)]",
  outline:
    "border border-phosphor/40 text-phosphor hover:border-phosphor hover:bg-phosphor hover:text-black",
  ghost: "text-ink hover:bg-phosphor hover:text-black",
};

/** Classes rather than a component, so links and ui-sdk parts can share them. */
export function button(
  variant: keyof typeof variants = "solid",
  className?: string,
) {
  return cn(base, variants[variant], "h-11 px-5", className);
}
