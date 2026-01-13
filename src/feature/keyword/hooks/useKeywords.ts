import { PlainKeyword } from "@/entity/keyword.entity";
import { keywordQueryApi } from "@/feature/keyword/keyword-query";
import { keywordsApi } from "@/share/lib/ky";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { HTTPError } from "ky";

export const useKeywords = (targetMemberId: string) => {
  const { data: keywords, isLoading } = useQuery(
    keywordQueryApi.findByTargetMemberId(targetMemberId),
  );

  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");

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

  const { mutate: createKeywordMutate } = createMutation;
  const { mutate: deleteKeywordMutate } = deleteMutation;

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

  const handleSubmit = useCallback(() => {
    setError("");
    if (newKeyword.trim()) {
      handleAddKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  }, [newKeyword, handleAddKeyword]);

  return {
    keywords: keywords || [],
    isLoading,
    newKeyword,
    setNewKeyword,
    handleAddKeyword,
    handleDeleteKeyword,
    handleSubmit,
    error,
    setError,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
