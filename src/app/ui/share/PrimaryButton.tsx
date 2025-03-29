"use client";

import { Button } from "flowbite-react";
import React from "react";

const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, children, className }) => {
  return (
    <Button
      color="primary"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
