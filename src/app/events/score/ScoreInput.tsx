import { InputScore } from "./ScoreRecord";

export const ScoreInput = ({
  text,
  value,
  scoreKey,
  onChange,
  readonly,
}: {
  value: number;
  scoreKey: keyof InputScore;
  text: string;
  onChange?: (name: keyof InputScore, value: number) => void;
  readonly?: boolean;
}) => {
  const id = !readonly ? String(scoreKey) : "";
  const name = !readonly ? String(scoreKey) : "";
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange(scoreKey, Number(e.target.value));
  };
  return (
    <div className="inline-flex flex-col max-w-20">
      <label htmlFor={id} className="px-2 mb-1 text-sm text-gray-600 text-nowrap">
        {text}점 갯수
      </label>
      <input
        name={name}
        readOnly={readonly}
        value={String(value)}
        onChange={onChangeInput}
        id={id}
        type="number"
        min={0}
        max={30}
        className={`p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 ${
          readonly &&
          "bg-gray-100 outline-none !focus:ring-0 border-none text-orange-500 font-bold !py-0"
        }`}
      />
    </div>
  );
};
