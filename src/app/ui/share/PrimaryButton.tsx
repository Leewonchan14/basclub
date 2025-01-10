"use client";

import React from "react";

const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 font-bold text-white transition-all rounded-md shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl text-nowrap disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
