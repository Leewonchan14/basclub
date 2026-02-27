"use client";

import { useConfirm } from "@/app/ui/share/ConfirmModal";
import { useLoginConfirm } from "@/app/ui/share/LoginConfirmModal";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/share/ui/select";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { Alert, AlertDescription } from "@/app/share/ui/alert";
import { Badge } from "@/app/share/ui/badge";
import { useCallback, useState } from "react";
import { MdInfo } from "react-icons/md";
import _ from "lodash";

export const JoinEventsButton = () => {
  const [guestCnt, setGuestCnt] = useState<number>(0);
  const [error, setError] = useState("");

  const { showConfirm, ConfirmComponent } = useConfirm();
  const { showLoginConfirm, LoginConfirmComponent } = useLoginConfirm();
  const { goToKakaoLogin } = useNeedLogin();

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
      <Alert variant="destructive" className="flex items-center">
        <div className="mr-4 h-4 w-4">
          <MdInfo className="h-full w-full" />
        </div>
        <AlertDescription>참가 기한이 마감되었습니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="join-button flex h-12 w-full items-center gap-2">
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
          {isJoin ? "참가취소" : "참가하기"}
        </PrimaryButton>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <MdInfo className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
  return (
    <Select
      value={guestCnt.toString()}
      disabled={disabled}
      onValueChange={(v) => setGuestCnt(Number(v))}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="게스트 수">
          <span className="flex gap-1">
            <span className="absolute -mt-6 bg-white px-2 font-bold text-gray-400">
              GUEST
            </span>{" "}
            <Badge className="bg-indigo-500 text-white hover:bg-indigo-600">
              {guestCnt}명
            </Badge>{" "}
            과 함께
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="">
        {_.range(0, 10).map((v) => (
          <SelectItem key={v} value={v.toString()}>
            <span className="flex gap-1">
              <Badge className="bg-indigo-500 text-white hover:bg-indigo-600">
                {v}명
              </Badge>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
