"use client";

import { Button } from "@/app/share/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/share/ui/dialog";
import { EPosition } from "@/entity/enum/position";
import { cn } from "@/share/utils";
import _ from "lodash";
import React, { useState } from "react";

export const POSITION_BADGE: Record<EPosition, string> = {
  [EPosition.GUARD]: "G",
  [EPosition.FORWARD]: "F",
  [EPosition.CENTER]: "C",
};

const POSITION_LABELS: Record<EPosition, string> = {
  [EPosition.GUARD]: "가드",
  [EPosition.FORWARD]: "포워드",
  [EPosition.CENTER]: "센터",
};

export const POSITION_BADGE_COLORS: Record<EPosition, string> = {
  [EPosition.GUARD]: "bg-green-800 text-white border-green-800",
  [EPosition.FORWARD]: "bg-blue-800 text-white border-blue-800",
  [EPosition.CENTER]: "bg-red-800 text-white border-red-800",
};

const POSITION_LABEL_COLORS: Record<EPosition, string> = {
  [EPosition.GUARD]:
    "bg-green-100 text-green-800 border-green-400 hover:bg-green-200",
  [EPosition.FORWARD]:
    "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  [EPosition.CENTER]: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
};

interface PositionSelectModalProps {
  onSave: (positions: EPosition[]) => void;
  currentPositions: EPosition[];
  isLoading?: boolean;
  trigger: React.ReactNode;
}

export const PositionSelectModal = ({
  onSave,
  currentPositions,
  isLoading = false,
  trigger,
}: PositionSelectModalProps) => {
  const [selectedPositions, setSelectedPositions] = useState<EPosition[]>(
    currentPositions || [],
  );

  const handleTogglePosition = (position: EPosition) => {
    setSelectedPositions((prev) => _.xor(prev, [position]));
  };

  const handleSave = () => {
    onSave(selectedPositions);
  };

  return (
    <Dialog>
      <DialogTrigger asChild disabled>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle>포지션 선택</DialogTitle>
          <DialogDescription>
            본인이 소화할 수 있는 포지션을 선택하세요. <br />{" "}
            <span className="text-xs text-gray-500">(다중 선택 가능)</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          {Object.values(EPosition).map((position) => (
            <Button
              disabled={isLoading}
              variant="ghost"
              key={position}
              onClick={() => handleTogglePosition(position)}
              className={`flex min-w-20 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 py-1 text-sm font-semibold transition-all ${cn(selectedPositions.includes(position) && POSITION_LABEL_COLORS[position])}`}
            >
              {POSITION_LABELS[position]}
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-sm border p-0.5 transition-all ${selectedPositions.includes(position) && POSITION_BADGE_COLORS[position]}`}
              >
                {POSITION_BADGE[position]}
              </div>
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// fotter = <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={handleSave}
//                 disabled={isLoading}
//                 className="focus:ring-primary-300 flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                     저장 중...
//                   </>
//                 ) : (
//                   "저장"
//                 )}
//               </button>
//             </div>
