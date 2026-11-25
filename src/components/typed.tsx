import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Types a line out with CSS alone. The text is all there from the start, so
 * screen readers, search engines and visitors without JavaScript get it whole.
 */
export function Typed({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn("typed", className)}
      style={{ "--chars": text.length } as CSSProperties}
    >
      <span className="typed-text">{text}</span>
      <span className="typed-caret" aria-hidden="true">
        _
      </span>
    </span>
  );
}
