"use client";

import { useConfirm } from "@/app/ui/share/ConfirmModal";
import { useLoginConfirm } from "@/app/ui/share/LoginConfirmModal";
import { PlusMinusButton } from "@/app/ui/share/plus-minus-button";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { Alert } from "flowbite-react";
import { useCallback, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export const JoinEventsButton = () => {
  const [guestCnt, setGuestCnt] = useState<number>(0);
  const [error, setError] = useState("");

  const { showConfirm, ConfirmComponent } = useConfirm();
  const { showLoginConfirm, LoginConfirmComponent } = useLoginConfirm();
  const { goToKakaoLogin } = useNeedLogin();

  const { ownGuestTeams } = useFetchSelectedEvents();
  const { isJoin, isEventEnd, isEventLimit, isPending, onJoin, isLoading } =
    useJoinEvents({
      guestCnt,
      confirmFn: showConfirm,
      withLoginConfirm: true,
    });

  const handleOnJoin = useCallback(async () => {
    setError("");
    if (!isJoin && isEventLimit) {
      setError("참가 인원이 초과되었습니다.");
      return;
    }
    try {
      await onJoin();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "LOGIN_CONFIRMATION_NEEDED"
      ) {
        const shouldLogin = await showLoginConfirm();
        if (shouldLogin) {
          goToKakaoLogin();
        }
      }
      // 잠시후 다시 시도 하게 해주는 메시지
      setError("잠시후 다시 시도 해주세요.");
    }
  }, [isJoin, isEventLimit, onJoin, showLoginConfirm, goToKakaoLogin]);

  if (isLoading) return null;

  if (isEventEnd) {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">참가 기한이 마감되었습니다.</span>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex h-12 w-full items-center gap-2">
        <InputGuest
          className="h-full w-full"
          guestCnt={guestCnt}
          setGuestCnt={setGuestCnt}
          disabled={isPending || isJoin}
        />
        <PrimaryButton
          className="flex h-full w-full flex-col text-nowrap !p-0 font-semibold"
          disabled={isPending || isEventEnd}
          onClick={handleOnJoin}
        >
          <div>{isJoin ? ownGuestTeams.length : guestCnt}명의 게스트와</div>
          <div>{isJoin ? "참가취소" : "참가하기"}</div>
        </PrimaryButton>
      </div>

      {error && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{error}</span>
        </Alert>
      )}

      <ConfirmComponent />
      <LoginConfirmComponent />
    </>
  );
};

interface InputGuestProps {
  className?: string;
  guestCnt: number;
  setGuestCnt: (cnt: number) => void;
  disabled: boolean;
}

const InputGuest: React.FC<InputGuestProps> = ({
  guestCnt,
  setGuestCnt,
  disabled,
  className,
}) => {
  // 포커스가 해제될때 0, 9으로 최대 최소값을 제한하는 함수
  const onBlur = useCallback(() => {
    const sorted = [0, guestCnt, 9].sort((a, b) => a - b);
    setGuestCnt(sorted[1]);
  }, [guestCnt, setGuestCnt]);

  return (
    <PlusMinusButton
      value={guestCnt}
      className={className}
      onChange={(v) => setGuestCnt([0, v, 9].sort((a, b) => a - b)[1])}
      onBlur={onBlur}
      disabled={disabled}
      min={0}
      max={9}
    />
  );
};
