import { PlainKeyword } from "@/entity/keyword.entity";
import { useKeywords } from "@/feature/keyword/hooks/useKeywords";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { AddKeywordInput } from "./AddKeywordInput";

interface KeywordAccordionProps {
  targetMemberId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const KeywordAccordion: React.FC<KeywordAccordionProps> = ({
  targetMemberId,
  isOpen,
  onToggle,
}) => {
  const { own } = useFetchOwn();
  const {
    keywords,
    isLoading,
    newKeyword,
    setNewKeyword,
    handleDeleteKeyword,
    handleSubmit,
    error,
    setError,
    isCreating,
    isDeleting,
  } = useKeywords(targetMemberId);

  if (!isOpen) return null;

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          키워드 ({keywords.length})
        </span>
        <button
          onClick={onToggle}
          className="rounded-md p-1 hover:bg-gray-200"
          aria-label="키워드 닫기"
        >
          <MdClose className="text-gray-600" />
        </button>
      </div>

      {own && (
        <AddKeywordInput
          newKeyword={newKeyword}
          setNewKeyword={setNewKeyword}
          onSubmit={handleSubmit}
          isPending={isCreating}
        />
      )}

      {error && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          onDismiss={() => setError("")}
        >
          <span className="font-medium">{error}</span>
        </Alert>
      )}

      {isLoading && (
        <div className="flex h-20 items-center justify-center text-gray-500">
          <span>불러오는 중...</span>
        </div>
      )}

      {!isLoading && keywords.length === 0 && (
        <div className="flex h-20 items-center justify-center text-gray-500">
          <span>키워드가 없습니다.</span>
        </div>
      )}

      {!isLoading && keywords.length > 0 && (
        <div className="flex flex-col gap-2">
          {keywords.map((keyword) => (
            <KeywordItem
              key={keyword.id}
              keyword={keyword}
              ownId={own?.id}
              onDelete={handleDeleteKeyword}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface KeywordItemProps {
  keyword: PlainKeyword;
  ownId?: string;
  onDelete: (keywordId: string) => void;
  isDeleting: boolean;
}

const KeywordItem: React.FC<KeywordItemProps> = ({
  keyword,
  ownId,
  onDelete,
  isDeleting,
}) => {
  const isOwnKeyword = keyword.author.id === ownId;

  return (
    <div className="flex items-start justify-between gap-2 rounded-md border border-gray-200 bg-white p-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          {keyword.keyword}
        </span>
        <span className="text-[10px] text-gray-400">익명</span>
      </div>
      {isOwnKeyword && (
        <button
          onClick={() => onDelete(keyword.id)}
          disabled={isDeleting}
          className="self-start rounded-md p-1 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
          aria-label="키워드 삭제"
        >
          <MdClose className="text-sm" />
        </button>
      )}
    </div>
  );
};
