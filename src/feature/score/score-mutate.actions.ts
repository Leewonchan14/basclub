"use server";

import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const addScore = async (
  eventsId: string,
  memberId: number,
  score2: number,
  score3: number
) => {
  await getService(ScoreService).addScore(memberId, eventsId, score2, score3);
};

export const deleteScore = async (scoreId: string) => {
  await getService(ScoreService).deleteScore(scoreId);
};
