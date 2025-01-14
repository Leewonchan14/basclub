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
    <div className="inline-flex flex-col items-center">
      <label
        htmlFor={id}
        className="px-2 mb-1 text-sm text-gray-600 text-nowrap"
      >
        {text}점 갯수
      </label>
      <div
        className={`flex bg-white border-2 rounded-lg overflow-clip ${
          readonly && "border-none"
        }`}
      >
        {!readonly && (
          <button
            onClick={() => onChange?.(scoreKey, Math.max(0, value - 1))}
            className="px-2 text-center border-r-2"
          >
            -
          </button>
        )}
        <input
          name={name}
          readOnly={readonly}
          value={String(value)}
          onChange={onChangeInput}
          id={id}
          type="number"
          min={0}
          max={30}
          className={`text-center p-2 transition-colors rounded outline-none ${
            readonly && "bg-gray-100 text-orange-500 font-bold !py-0"
          }`}
        />
        {!readonly && (
          <button
            onClick={() => onChange?.(scoreKey, Math.min(30, value + 1))}
            className="px-2 text-center border-l-2"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};
