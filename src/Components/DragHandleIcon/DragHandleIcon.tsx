interface DragHandleIconProps {
  className?: string;
}

export default function DragHandleIcon({
  className = "",
}: DragHandleIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="5" r="1.2" fill="currentColor" />

      <circle cx="6" cy="9" r="1.2" fill="currentColor" />
      <circle cx="12" cy="9" r="1.2" fill="currentColor" />

      <circle cx="6" cy="13" r="1.2" fill="currentColor" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}
