import type { IconData } from "@/data/brands";

export function BrandIcon({
  icon,
  className,
}: {
  icon: IconData;
  className?: string;
}) {
  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {icon.d.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
