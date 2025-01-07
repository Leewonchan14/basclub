"use server";

import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const getScore = async (memberId: number) => {
  return await getService(ScoreService).findScoresAVGByMemberId(memberId);
};

export const addScore = async (
  memberId: number,
  eventsId: string,
  score2: number,
  score3: number
) => {
  return await getService(ScoreService).addScore(
    memberId,
    eventsId,
    score2,
    score3
  );
};
