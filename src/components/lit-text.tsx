import type { CSSProperties } from "react";

/** A paragraph that lights up word by word as it scrolls into view. */
export function LitText({ children }: { children: string }) {
  const words = children.split(" ");
  return (
    <p className="lit">
      {words.map((word, i) => (
        <span key={i}>
          <span
            className="lit-word"
            style={{ "--at": i / words.length } as CSSProperties}
          >
            {word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
