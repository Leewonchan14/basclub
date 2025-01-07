import React from "react";

interface Props {
  text?: string;
}

export const Spinner: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-4 text-3xl font-bold text-center text-orange-500">
      {text && <div>{text}</div>}
      <div className="w-6 h-6 border-4 border-orange-500 rounded-full aspect-square animate-spin border-t-white" />
    </div>
  );
};
