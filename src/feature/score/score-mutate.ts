import { addScore } from "@/feature/score/score-mutate.actions";

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
      // getQueryClient().invalidateQueries({
      //   queryKey: [...eventsQueryApi.findById(eventsId, false).queryKey],
      // });
    },
  }),
};
