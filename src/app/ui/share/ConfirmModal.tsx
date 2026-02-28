"use client";

import { Button } from "@/app/share/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/share/ui/dialog";
import { useState } from "react";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center">
          <DialogTitle className="text-center text-lg font-normal text-gray-500">
            {message}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-800">
            확인
          </Button>
          <Button onClick={onClose} variant="outline">
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
