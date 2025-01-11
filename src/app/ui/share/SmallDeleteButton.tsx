"use client";

interface Props {
  onClick: () => void;
  className?: string;
}

export const SmallDeleteButton: React.FC<Props> = function ({
  onClick,
  className,
}) {
  return (
    <button
      className={`absolute inline-block w-4 h-4 ml-auto text-xs text-white bg-red-600 rounded-full ${className}`}
      onClick={onClick}
    >
      x
    </button>
  );
};
