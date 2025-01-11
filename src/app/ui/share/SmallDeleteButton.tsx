"use client";

interface Props {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const SmallDeleteButton: React.FC<Props> = function ({
  onClick,
  className,
  disabled,
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-block w-4 h-4 ml-auto text-xs text-white bg-red-600 rounded-full disabled:opacity-30 ${className}`}
      onClick={onClick}
    >
      x
    </button>
  );
};
