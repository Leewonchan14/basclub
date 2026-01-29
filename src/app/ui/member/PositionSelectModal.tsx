"use client";

import { EPosition } from "@/entity/enum/position";
import React, { useState } from "react";

interface PositionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (positions: EPosition[]) => void;
  currentPositions: EPosition[];
  isLoading?: boolean;
}

const POSITION_LABELS: Record<EPosition, string> = {
  [EPosition.GUARD]: "가드",
  [EPosition.FORWARD]: "포워드",
  [EPosition.CENTER]: "센터",
};

const POSITION_COLORS: Record<EPosition, string> = {
  [EPosition.GUARD]: "bg-blue-100 text-blue-800 border-blue-300",
  [EPosition.FORWARD]: "bg-green-100 text-green-800 border-green-300",
  [EPosition.CENTER]: "bg-red-100 text-red-800 border-red-300",
};

export const PositionSelectModal = ({
  isOpen,
  onClose,
  onSave,
  currentPositions,
  isLoading = false,
}: PositionSelectModalProps) => {
  const [selectedPositions, setSelectedPositions] = useState<EPosition[]>(
    currentPositions || [],
  );

  const handleTogglePosition = (position: EPosition) => {
    setSelectedPositions((prev) => {
      if (prev.includes(position)) {
        return prev.filter((p) => p !== position);
      } else {
        return [...prev, position];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedPositions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-900">포지션 선택</h3>
          <p className="mt-2 text-sm text-gray-500">
            본인이 소화할 수 있는 포지션을 선택하세요. (다중 선택 가능)
          </p>
        </div>

        <div className="space-y-3">
          {Object.values(EPosition).map((position) => (
            <label
              key={position}
              className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-gray-300"
            >
              <input
                type="checkbox"
                checked={selectedPositions.includes(position)}
                onChange={() => handleTogglePosition(position)}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${POSITION_COLORS[position]}`}
              >
                {POSITION_LABELS[position]}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="focus:ring-primary-300 flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
