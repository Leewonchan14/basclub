"use client";

import { useState } from "react";
import { MdWarning } from "react-icons/md";

interface ConfirmModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  message,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
            <MdWarning className="h-14 w-14 text-red-600" />
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500">{message}</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
            >
              확인
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm 함수 생성을 위한 hook
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    message: string;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    message: "",
  });

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  return {
    confirmState,
    showConfirm,
    ConfirmComponent: () => (
      <ConfirmModal
        message={confirmState.message}
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    ),
  };
};
