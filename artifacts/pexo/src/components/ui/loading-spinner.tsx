import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Classic loading.io-style circular spinner.
 * 12 oval segments arranged in a ring, each fading from light to dark
 * as they rotate — pure SVG, no icon libraries required.
 */
export function LoadingSpinner({
  className,
  size = 48,
  color = "#403f3f",
}: LoadingSpinnerProps) {
  const segments = 12;
  const r = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("animate-spin", className)}
      style={{ animationDuration: "1s", animationTimingFunction: "steps(12, end)" }}
      aria-label="Loading"
      role="status"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * 360;
        const opacity = (i + 1) / segments;

        // Each segment is a small rounded rect (oval) rotated around the center
        const segW = size * 0.09;
        const segH = size * 0.24;
        const segX = r - segW / 2;
        const segY = size * 0.06;

        return (
          <rect
            key={i}
            x={segX}
            y={segY}
            width={segW}
            height={segH}
            rx={segW / 2}
            ry={segW / 2}
            fill={color}
            opacity={opacity}
            transform={`rotate(${angle}, ${r}, ${r})`}
          />
        );
      })}
    </svg>
  );
}
