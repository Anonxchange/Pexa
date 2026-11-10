interface PexlyIconProps {
  className?: string;
}

export function PexlyIcon({ className }: PexlyIconProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 140 80 A 60 60 0 1 0 80 140"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="128" cy="128" r="12" fill="currentColor" />
    </svg>
  );
}
