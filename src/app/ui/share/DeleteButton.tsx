"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";

export const DeleteButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, children, className }) => {
  return (
    <PrimaryButton
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex justify-center gap-2 !from-red-500 !to-red-600 !hover:from-red-700 !hover:to-red-800 ${className}`}
    >
      {children}
    </PrimaryButton>
  );
};
