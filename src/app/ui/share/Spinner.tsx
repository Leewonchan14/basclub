import React from "react";

interface Props {
  children: React.ReactNode;
}

interface SpinnerComponent extends React.FC<Props> {
  Text: React.FC<{ text: string; className?: string }>;
  Spin: React.FC<{ className?: string }>;
}

const Spinner: SpinnerComponent = ({ children }) => {
  return (
    <div className="flex items-center justify-center gap-4 text-3xl font-bold text-center text-orange-500">
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
      className={`w-6 h-6 border-4 border-orange-500 rounded-full aspect-square animate-spin border-t-white ${className}`}
    />
  );
};

Spinner.Text = Text;
Spinner.Spin = Spin;
export default Spinner;
