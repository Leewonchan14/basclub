"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/share/ui/dialog";
import { Button } from "@/app/share/ui/button";

interface LoginConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LoginConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LoginConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200">
            <svg
              className="mx-auto h-14 w-14 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <DialogTitle className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            로그인이 필요합니다
          </DialogTitle>
          <DialogDescription className="mb-5 space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <p>이벤트에 참가하시려면 카카오 로그인이 필요합니다.</p>
            <div className="rounded-lg bg-blue-50 p-3 text-left dark:bg-blue-900/30">
              <div className="flex items-start space-x-2">
                <svg
                  className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
                  <p className="mb-1 font-medium">개인정보 보호 안내</p>
                  <p>• 수집된 정보는 서비스 이용을 위해서만 사용됩니다</p>
                  <p>• 개인정보를 제3자에게 제공하거나 판매하지 않습니다</p>
                  <p>• 언제든지 계정 삭제 및 정보 삭제를 요청할 수 있습니다</p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center gap-4">
          <Button
            onClick={onConfirm}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            카카오로 로그인
          </Button>
          <Button onClick={onClose} variant="outline">
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 로그인 확인 함수 생성을 위한 hook
export const useLoginConfirm = () => {
  const [loginConfirmState, setLoginConfirmState] = useState<{
    isOpen: boolean;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
  });

  const showLoginConfirm = (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setLoginConfirmState({
        isOpen: true,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (loginConfirmState.resolve) {
      loginConfirmState.resolve(true);
    }
    setLoginConfirmState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: undefined,
    }));
  };

  const handleCancel = () => {
    if (loginConfirmState.resolve) {
      loginConfirmState.resolve(false);
    }
    setLoginConfirmState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: undefined,
    }));
  };

  return {
    loginConfirmState,
    showLoginConfirm,
    LoginConfirmComponent: () => (
      <LoginConfirmModal
        isOpen={loginConfirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    ),
  };
};
