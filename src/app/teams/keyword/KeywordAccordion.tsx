"use client";

import { KeywordResponse } from "@/feature/keyword/keyword-query";
import { PlainMember } from "@/entity/member.entity";
import { EVoteType } from "@/entity/enum/vote-type";
import { useKeywords } from "@/feature/keyword/hooks/useKeywords";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Alert, AlertDescription } from "@/app/share/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/share/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/share/ui/select";
import {
  MdClose,
  MdInfo,
  MdThumbDown,
  MdThumbUp,
  MdThumbUpOffAlt,
  MdThumbDownOffAlt,
} from "react-icons/md";
import { AddKeywordInput } from "./AddKeywordInput";
import { day_js } from "@/share/lib/dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/share/ui/avatar";
import { cn } from "@/share/utils";

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
    meta,
    page,
    setPage,
    isLoading,
    newKeyword,
    setNewKeyword,
    handleDeleteKeyword,
    handleVoteKeyword,
    handleSubmit,
    error,
    isCreating,
    isDeleting,
    sortBy,
    handleSortByChange,
  } = useKeywords(targetMemberId, own?.id);

  if (!isOpen) return null;

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          키워드 ({meta?.total || 0})
        </span>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: "popularity" | "newest") =>
              handleSortByChange(value)
            }
          >
            <SelectTrigger className="h-7 w-[80px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">인기순</SelectItem>
              <SelectItem value="newest">최신순</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={onToggle}
            className="rounded-md p-1 hover:bg-gray-200"
            aria-label="키워드 닫기"
          >
            <MdClose className="text-gray-600" />
          </button>
        </div>
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
        <Alert variant="destructive">
          <MdInfo className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
          {keywords.map((keyword: KeywordResponse["items"][0]) => (
            <KeywordItem
              key={keyword.id}
              keyword={keyword}
              ownId={own?.id}
              onDelete={handleDeleteKeyword}
              onVote={handleVoteKeyword}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {!isLoading && meta && meta.totalPages > 1 && (
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className={
                  page === meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

interface KeywordItemProps {
  keyword: KeywordResponse["items"][0];
  ownId?: string;
  onDelete: (keywordId: string) => void;
  onVote: (keywordId: string, type: EVoteType) => void;
  isDeleting: boolean;
}

const KeywordItem: React.FC<KeywordItemProps> = ({
  keyword,
  ownId,
  onDelete,
  onVote,
  isDeleting,
}) => {
  const isOwnKeyword = keyword.author.id === ownId;
  const isTargetMember = keyword.targetMember.id === ownId;
  const canDelete = isOwnKeyword || isTargetMember;

  const myVote = keyword.votes?.find((v) => v.voter.id === ownId);
  const isLiked = myVote?.type === EVoteType.LIKE;
  const isDisliked = myVote?.type === EVoteType.DISLIKE;

  const likeVoters =
    keyword.votes
      ?.filter((v) => v.type === EVoteType.LIKE)
      .map((v) => v.voter) || [];
  const dislikeVoters =
    keyword.votes
      ?.filter((v) => v.type === EVoteType.DISLIKE)
      .map((v) => v.voter) || [];

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-medium text-gray-800">
            {keyword.keyword}
          </span>
          <span className="text-[10px] text-gray-400">
            {day_js(keyword.createdAt).format("MM/DD HH:mm")}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(keyword.id)}
            disabled={isDeleting}
            className="rounded-md p-1 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
            aria-label={
              isTargetMember ? "내 키워드 삭제" : "작성한 키워드 삭제"
            }
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" />
            ) : (
              <MdClose className="text-sm" />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(keyword.id, EVoteType.LIKE)}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-blue-50",
              isLiked ? "text-blue-600" : "text-gray-500",
            )}
          >
            {isLiked ? <MdThumbUp /> : <MdThumbUpOffAlt />}
            <span className="text-xs font-bold">{keyword.likeCount}</span>
          </button>

          <AvatarStack voters={likeVoters} max={3} />
        </div>

        <div className="flex items-center gap-2">
          <AvatarStack voters={dislikeVoters} max={3} />

          <button
            onClick={() => onVote(keyword.id, EVoteType.DISLIKE)}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-red-50",
              isDisliked ? "text-red-600" : "text-gray-500",
            )}
          >
            {isDisliked ? <MdThumbDown /> : <MdThumbDownOffAlt />}
            <span className="text-xs font-bold">{keyword.dislikeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AvatarStack: React.FC<{ voters: PlainMember[]; max: number }> = ({
  voters,
  max,
}) => {
  if (voters.length === 0) return null;

  const displayVoters = voters.slice(0, max);
  const remaining = voters.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {displayVoters.map((voter) => (
        <Avatar key={voter.id} className="h-5 w-5 border-2 border-white">
          <AvatarImage src={voter.profileUrl} alt={voter.nickname} />
          <AvatarFallback className="bg-gray-200 text-[8px]">
            {voter.nickname?.[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[8px] font-bold text-gray-500">
          +{remaining}
        </div>
      )}
    </div>
  );
};
