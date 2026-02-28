"use client";

import { Button } from "@/app/share/ui/button";

export const DeleteButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, children, className }) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex justify-center gap-2 bg-red-600 hover:bg-red-700 ${className}`}
    >
      {children}
    </Button>
  );
};
