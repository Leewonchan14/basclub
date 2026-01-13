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

  return (
    <div className="flex w-full items-center gap-2">
      <input
        type="text"
        value={newKeyword}
        onChange={(e) => setNewKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="키워드 입력..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        maxLength={100}
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
  );
};
