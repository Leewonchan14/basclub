import { EPosition } from "@/entity/enum/position";

export const POSITION_BADGE: Record<EPosition, string> = {
  [EPosition.GUARD]: "G",
  [EPosition.FORWARD]: "F",
  [EPosition.CENTER]: "C",
};

export const POSITION_BADGE_COLORS: Record<EPosition, string> = {
  [EPosition.GUARD]: "bg-green-800 text-white border-green-800",
  [EPosition.FORWARD]: "bg-blue-800 text-white border-blue-800",
  [EPosition.CENTER]: "bg-red-800 text-white border-red-800",
};

export const POSITION_LABEL_COLORS: Record<EPosition, string> = {
  [EPosition.GUARD]:
    "bg-green-100 text-green-800 border-green-400 hover:bg-green-200",
  [EPosition.FORWARD]:
    "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  [EPosition.CENTER]: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
};

export const POSITION_LABELS: Record<EPosition, string> = {
  [EPosition.GUARD]: "가드",
  [EPosition.FORWARD]: "포워드",
  [EPosition.CENTER]: "센터",
};
