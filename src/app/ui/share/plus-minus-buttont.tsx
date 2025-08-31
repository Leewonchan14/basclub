import React from "react";

export const PlusMinusButton: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    value: number;
    onChange: (value: number) => void;
  }
> = ({ value, onChange, disabled, className, onBlur, ...props }) => {
  return (
    <div className={`flex items-center ${className} `}>
      <MinusButton
        disabled={!!disabled}
        onClick={() => onChange(Number(value) - 1)}
      />
      <input
        type="number"
        id="quantity-input"
        data-input-counter
        aria-describedby="helper-text-explanation"
        className="block h-11 w-full min-w-10 border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        value={String(value)}
        onBlur={(e) => {
          onChange(value || 0);
          onBlur?.(e);
        }}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
        disabled={disabled}
        {...props}
      />
      <PlusButton
        disabled={!!disabled}
        onClick={() => onChange(Number(value) + 1)}
      />
    </div>
  );
};

interface ButtonProps {
  onClick: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  className?: string;
  disabled: boolean;
}

const MinusButton = ({ onClick, className, disabled }: ButtonProps) => {
  return (
    <button
      data-testid="minus-button"
      type="button"
      id="decrement-button"
      className={`h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="h-3 w-3 text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 2"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h16"
        />
      </svg>
    </button>
  );
};

const PlusButton = ({ onClick, className, disabled }: ButtonProps) => {
  return (
    <button
      data-testid="plus-button"
      type="button"
      id="increment-button"
      className={`h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="h-3 w-3 text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 18"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 1v16M1 9h16"
        />
      </svg>
    </button>
  );
};
