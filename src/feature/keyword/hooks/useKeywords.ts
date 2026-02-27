import { PlainKeyword } from "@/entity/keyword.entity";
import { EVoteType } from "@/entity/enum/vote-type";
import { ERole } from "@/entity/enum/role";
import { keywordQueryApi } from "@/feature/keyword/keyword-query";
import { keywordsApi } from "@/share/lib/ky";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { HTTPError } from "ky";

export const useKeywords = (targetMemberId: string, currentUserId?: string) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"popularity" | "newest">("popularity");
  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");

  const handleSortByChange = useCallback(
    (newSortBy: "popularity" | "newest") => {
      setSortBy(newSortBy);
      setPage(1);
    },
    [],
  );

  const { data: keywordData, isLoading } = useQuery(
    keywordQueryApi.findByTargetMemberId(targetMemberId, page, 5, sortBy),
  );

  const keywords = keywordData?.items || [];
  const meta = keywordData?.meta;

  const createMutation = useMutation({
    mutationKey: ["keywords", "create"],
    mutationFn: async (data: { keyword: string; targetMemberId: string }) => {
      return keywordsApi.post("", { json: data }).json<PlainKeyword>();
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof HTTPError) {
        if (error.response.status === 409) {
          setError("이미 등록한 키워드예요.");
          return;
        }
      }

      if (error instanceof Error) {
        setError("키워드 등록 중 오류가 발생했습니다.");
      } else {
        setError("잠시 후 다시 시도해 주세요.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["keywords", "delete"],
    mutationFn: async (keywordId: string) => {
      return keywordsApi.delete(`${keywordId}`).json<{ success: boolean }>();
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });
    },
  });

  const voteMutation = useMutation({
    mutationKey: ["keywords", "vote"],
    mutationFn: async ({
      keywordId,
      type,
    }: {
      keywordId: string;
      type: EVoteType;
    }) => {
      return keywordsApi
        .post(`${keywordId}/vote`, { json: { type } })
        .json<PlainKeyword>();
    },
    onMutate: async ({ keywordId, type }) => {
      await getQueryClient().cancelQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });

      const previousData = getQueryClient().getQueryData(
        keywordQueryApi.findByTargetMemberId(targetMemberId, page, 5, sortBy)
          .queryKey,
      );

      getQueryClient().setQueryData(
        keywordQueryApi.findByTargetMemberId(targetMemberId, page, 5, sortBy)
          .queryKey,
        (old) => {
          if (!old || !old.items) return old;

          return {
            ...old,
            items: old.items.map((item) => {
              if (item.id !== keywordId) return item;

              const existingVote = item.votes?.find(
                (v) => v.voter.id === currentUserId,
              );
              let newLikeCount = item.likeCount;
              let newDislikeCount = item.dislikeCount;
              let newVotes = [...(item.votes || [])];

              if (existingVote) {
                if (existingVote.type === type) {
                  newVotes = newVotes.filter(
                    (v) => v.voter.id !== currentUserId,
                  );
                  if (type === EVoteType.LIKE) {
                    newLikeCount--;
                  } else {
                    newDislikeCount--;
                  }
                } else {
                  newVotes = newVotes.map((v) =>
                    v.voter.id === currentUserId ? { ...v, type } : v,
                  );
                  if (type === EVoteType.LIKE) {
                    newLikeCount++;
                    newDislikeCount--;
                  } else {
                    newLikeCount--;
                    newDislikeCount++;
                  }
                }
              } else {
                newVotes.push({
                  id: "temp-vote",
                  type,
                  voter: {
                    id: currentUserId || "temp-user",
                    nickname: "현재 사용자",
                    profileUrl: "",
                    role: ERole.MEMBER,
                    guestById: undefined,
                    positions: [],
                  },
                });
                if (type === EVoteType.LIKE) {
                  newLikeCount++;
                } else {
                  newDislikeCount++;
                }
              }

              return {
                ...item,
                netScore: newLikeCount - newDislikeCount,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
                votes: newVotes,
              };
            }),
          };
        },
      );

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        getQueryClient().setQueryData(
          keywordQueryApi.findByTargetMemberId(targetMemberId, page, 5, sortBy)
            .queryKey,
          context.previousData,
        );
      }
    },
    onSettled: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });
    },
  });

  const { mutate: createKeywordMutate } = createMutation;
  const { mutate: deleteKeywordMutate } = deleteMutation;
  const { mutate: voteKeywordMutate } = voteMutation;

  const handleAddKeyword = useCallback(
    (keyword: string) => {
      createKeywordMutate({
        keyword,
        targetMemberId,
      });
    },
    [createKeywordMutate, targetMemberId],
  );

  const handleDeleteKeyword = useCallback(
    (keywordId: string) => {
      deleteKeywordMutate(keywordId);
    },
    [deleteKeywordMutate],
  );

  const handleVoteKeyword = useCallback(
    (keywordId: string, type: EVoteType) => {
      voteKeywordMutate({ keywordId, type });
    },
    [voteKeywordMutate],
  );

  const handleSubmit = useCallback(() => {
    setError("");
    if (newKeyword.trim()) {
      handleAddKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  }, [newKeyword, handleAddKeyword]);

  return {
    keywords,
    meta,
    page,
    setPage,
    sortBy,
    handleSortByChange,
    isLoading,
    newKeyword,
    setNewKeyword,
    handleAddKeyword,
    handleDeleteKeyword,
    handleVoteKeyword,
    handleSubmit,
    error,
    setError,
    voteMutation,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
