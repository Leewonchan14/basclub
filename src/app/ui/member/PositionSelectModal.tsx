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
import {
  POSITION_BADGE,
  POSITION_BADGE_COLORS,
  POSITION_LABELS,
  POSITION_LABEL_COLORS,
} from "@/share/constants/position";
import { cn } from "@/share/utils";
import _ from "lodash";
import React, { useEffect, useState } from "react";

interface PositionSelectModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (positions: EPosition[]) => void;
  currentPositions: EPosition[];
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

export const PositionSelectModal = ({
  open: controlledOpen,
  onOpenChange,
  onSave,
  currentPositions,
  isLoading = false,
  trigger,
}: PositionSelectModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<EPosition[]>(
    currentPositions || [],
  );

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    if (open) {
      setSelectedPositions(currentPositions || []);
    }
  }, [open, currentPositions]);

  const handleTogglePosition = (position: EPosition) => {
    setSelectedPositions((prev) => _.xor(prev, [position]));
  };

  const handleSave = () => {
    onSave(selectedPositions);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border p-0.5 transition-all ${selectedPositions.includes(position) && POSITION_BADGE_COLORS[position]}`}
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
