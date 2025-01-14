export interface ScoreField {
  score2: number;
  score3: number;
  assist: number;
  rebound: number;
  steal: number;
}

export const ScoreFieldMap = {
  score2: "2점",
  score3: "3점",
  assist: "어시스트",
  rebound: "리바운드",
  steal: "스틸",
} as const;
