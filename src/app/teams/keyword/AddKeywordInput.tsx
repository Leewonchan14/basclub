import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { FaPlus } from "react-icons/fa6";

interface AddKeywordInputProps {
  newKeyword: string;
  setNewKeyword: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export const AddKeywordInput: React.FC<AddKeywordInputProps> = ({
  newKeyword,
  setNewKeyword,
  onSubmit,
  isPending,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const isOverLimit = newKeyword.length > 8;
  const remainingChars = Math.max(0, 8 - newKeyword.length);

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-center gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="키워드 입력..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          maxLength={8}
          disabled={isPending}
        />
        <PrimaryButton
          onClick={onSubmit}
          disabled={!newKeyword.trim() || isPending}
          className="flex items-center gap-1"
        >
          <FaPlus className="text-sm" />
          <span>추가</span>
        </PrimaryButton>
      </div>
      {isOverLimit && (
        <p className="text-xs text-red-600">참가 기한이 마감되었습니다.</p>
      )}
      {!isOverLimit && newKeyword.length > 0 && (
        <p className="text-xs text-gray-500">{remainingChars} / 8 자</p>
      )}
    </div>
  );
};
