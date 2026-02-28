import { cn } from "@/share/utils";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

interface SpinnerComponent extends React.FC<Props> {
  Text: React.FC<{ text: string; className?: string }>;
  Spin: React.FC<{ className?: string }>;
}

const Spinner: SpinnerComponent = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-center text-sm font-bold text-orange-500",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Text: SpinnerComponent["Text"] = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return text && <div className={className}>{text}</div>;
};

const Spin: SpinnerComponent["Spin"] = ({ className }) => {
  return (
    <div
      className={cn(
        "aspect-square h-4 w-4 animate-spin rounded-full border-4 border-orange-500 border-t-white",
        className,
      )}
    />
  );
};

Spinner.Text = Text;
Spinner.Spin = Spin;
export default Spinner;
