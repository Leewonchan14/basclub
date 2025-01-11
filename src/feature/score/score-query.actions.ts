"use server";

import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const getScoreByMemberId = async (memberId: string) => {
  return await getService(ScoreService).findScoresAVGByMemberId(memberId);
};

export const getAvgScoresByEventsId = async (eventsId: string) => {
  return await getService(ScoreService).findAvgScoresByEventsId(eventsId);
};

export const getPageScoresByEventsId = async (
  eventsId: string,
  cursor?: string
) => {
  const scores = await getService(ScoreService).findPageScoresByCursor(
    eventsId,
    cursor
  );
  return await Promise.all(scores.map(async (s) => s.toPlain()));
};
