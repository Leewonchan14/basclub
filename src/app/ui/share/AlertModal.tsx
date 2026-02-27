"use client";

import { useState } from "react";
import { MdInfo } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/share/ui/dialog";
import { Button } from "@/app/share/ui/button";

interface AlertModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertModal = ({ message, isOpen, onClose }: AlertModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center">
          <DialogTitle className="text-center text-lg font-normal text-gray-500">
            {message}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="justify-center">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-800">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Alert 함수 생성을 위한 hook
export const useAlert = () => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    resolve?: () => void;
  }>({
    isOpen: false,
    message: "",
  });

  const showAlert = (message: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve,
      });
    });
  };

  const closeAlert = () => {
    if (alertState.resolve) {
      alertState.resolve();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  return {
    alertState,
    showAlert,
    closeAlert,
    AlertComponent: () => (
      <AlertModal
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={closeAlert}
      />
    ),
  };
};
