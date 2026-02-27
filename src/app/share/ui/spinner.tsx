import { cn } from "@/share/utils/index";
import * as React from "react";

export const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-8 w-8 items-center justify-center", className)}
    {...props}
  >
    <svg
      className="h-6 w-6 animate-spin text-primary-500"
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
        d="M4 12a8 8 0 0 0 16 0a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>
));
Spinner.displayName = "Spinner";
