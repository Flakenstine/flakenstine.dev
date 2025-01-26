import * as React from "react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg bg-gray-800 p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-400">{children}</p>;
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4">{children}</div>;
}

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";
