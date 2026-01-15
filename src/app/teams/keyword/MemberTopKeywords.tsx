"use client";

import { KeywordResponse } from "@/feature/keyword/keyword-query";
import { useKeywords } from "@/feature/keyword/hooks/useKeywords";
import { cn } from "@/share/utils";
import { EVoteType } from "@/entity/enum/vote-type";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/share/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/share/ui/avatar";
import {
  MdThumbUp,
  MdThumbDown,
  MdThumbUpOffAlt,
  MdThumbDownOffAlt,
} from "react-icons/md";
import { PlainMember } from "@/entity/member.entity";

interface MemberTopKeywordsProps {
  memberId: string;
}

const Badge = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px]",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

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
        <Avatar key={voter.id} className="h-4 w-4 border-2 border-white">
          <AvatarImage src={voter.profileUrl} alt={voter.nickname} />
          <AvatarFallback className="bg-gray-200 text-[6px]">
            {voter.nickname?.[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[6px] font-bold text-gray-500">
          +{remaining}
        </div>
      )}
    </div>
  );
};

const BADGE_COLORS = [
  "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
  "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200",
  "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
  "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200",
  "bg-lime-100 text-lime-700 hover:bg-lime-200 border-lime-200",
  "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
  "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
  "bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200",
  "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-200",
  "bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200",
  "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
  "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200",
  "bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200",
  "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200",
  "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 border-fuchsia-200",
  "bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200",
  "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200",
];

export const MemberTopKeywords: React.FC<MemberTopKeywordsProps> = ({
  memberId,
}) => {
  const { own } = useFetchOwn();
  const { keywords, isLoading, voteMutation } = useKeywords(memberId, own?.id);

  if (isLoading || keywords.length === 0) return null;

  const topKeywords = keywords.slice(0, 5);

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {topKeywords.map(
          (keyword: KeywordResponse["items"][0], index: number) => {
            const colorClass = BADGE_COLORS[index % BADGE_COLORS.length];
            const myVote = keyword.votes?.find((v) => v.voter.id === own?.id);
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
              <Tooltip key={keyword.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative z-50 inline-flex cursor-help items-center rounded-md border px-2 py-0.5 text-[10px]",
                      colorClass,
                    )}
                  >
                    {keyword.keyword}
                    {keyword.netScore > 0 && (
                      <span className="ml-1 opacity-70">
                        +{keyword.netScore}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="z-50 max-w-xs p-0" sideOffset={5}>
                  <div className="rounded-lg border bg-gray-100 p-3 shadow-lg">
                    <div className="mb-2 text-sm font-medium text-gray-800">
                      {keyword.keyword}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            voteMutation.mutate({
                              keywordId: keyword.id,
                              type: EVoteType.LIKE,
                            });
                          }}
                          className={cn(
                            "flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-blue-50",
                            isLiked ? "text-blue-600" : "text-gray-500",
                          )}
                        >
                          {isLiked ? <MdThumbUp /> : <MdThumbUpOffAlt />}
                          <span className="text-xs font-bold">
                            {keyword.likeCount}
                          </span>
                        </button>

                        <AvatarStack voters={likeVoters} max={3} />
                      </div>

                      <div className="flex items-center gap-2">
                        <AvatarStack voters={dislikeVoters} max={3} />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            voteMutation.mutate({
                              keywordId: keyword.id,
                              type: EVoteType.DISLIKE,
                            });
                          }}
                          className={cn(
                            "flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-red-50",
                            isDisliked ? "text-red-600" : "text-gray-500",
                          )}
                        >
                          <span className="text-xs font-bold">
                            {keyword.dislikeCount}
                          </span>
                          {isDisliked ? <MdThumbDown /> : <MdThumbDownOffAlt />}
                        </button>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          },
        )}
      </div>
    </TooltipProvider>
  );
};
