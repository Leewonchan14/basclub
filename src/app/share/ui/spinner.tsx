import { cn } from "@/share/utils/index";
import * as React from "react";

export const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-transparent",
      className,
    )}
    {...props}
  >
    <svg
      className="h-5 w-5 animate-spin text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="none"
        d="M4 12a8 8 0 0 0 0 0 0 0"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  </div>
));
Spinner.displayName = "Spinner";
