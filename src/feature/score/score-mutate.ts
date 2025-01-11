import { addScore, deleteScore } from "@/feature/score/score-mutate.actions";
import { scoreQueryApi } from "@/feature/score/score-query";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

interface PlainScore {
  eventsId: string;
  memberId: number;
  score2: number;
  score3: number;
}

export const scoreMutateOption = {
  addScore: (eventsId: string, memberId: number) => ({
    mutationKey: ["events", eventsId, memberId, "addScore"],
    mutationFn: async ({ eventsId, memberId, score2, score3 }: PlainScore) => {
      await addScore(eventsId, memberId, score2, score3);
      return;
    },
    onSuccess: (_data: unknown, _variables: PlainScore) => {
      getQueryClient().invalidateQueries({
        queryKey: [...scoreQueryApi.findScoreByEvents(eventsId).queryKey],
      });
      getQueryClient().invalidateQueries({
        queryKey: [...scoreQueryApi.findByMemberId(memberId ?? 0).queryKey],
      });
    },
  }),

  deleteScore: (eventsId: string, memberId: number) => {
    return {
      mutationKey: ["score", "delete"],
      mutationFn: async (scoreId: string) => {
        await deleteScore(scoreId);
      },
      onSuccess: (_data: unknown, _variables: string, _context: unknown) => {
        getQueryClient().invalidateQueries({
          queryKey: [...scoreQueryApi.findScoreByEvents(eventsId).queryKey],
        });
        getQueryClient().invalidateQueries({
          queryKey: [...scoreQueryApi.findByMemberId(memberId).queryKey],
        });
      },
    };
  },
};
