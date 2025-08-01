"use client";

import { useState } from "react";
import { MdInfo } from "react-icons/md";

interface AlertModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertModal = ({ message, isOpen, onClose }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
            <MdInfo className="h-14 w-14 text-blue-600" />
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500">{message}</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
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
