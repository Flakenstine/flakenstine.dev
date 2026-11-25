import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

/** The part of the page that changes between routes. */
export function Page({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main id="main" tabIndex={-1} className={cn("outline-none", className)}>
        {children}
      </main>
    </ViewTransition>
  );
}
