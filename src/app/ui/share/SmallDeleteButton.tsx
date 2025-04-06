"use client";
import { MdDeleteOutline } from "react-icons/md";

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
      className={`block aspect-square rounded-full text-red-500 disabled:opacity-30 ${className}`}
      onClick={onClick}
    >
      <MdDeleteOutline />
    </button>
  );
};
