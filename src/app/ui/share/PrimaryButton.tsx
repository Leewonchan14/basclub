"use client";

import { Button } from "@/app/share/ui/button";
import React from "react";

const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, children, className }) => {
  return (
    <Button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
