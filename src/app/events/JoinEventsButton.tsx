"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import _ from "lodash";
import { ChangeEvent, useCallback, useState } from "react";

export const JoinEventsButton = () => {
  const [guestCnt, setGuestCnt] = useState<number>(0);
  const { isJoin, isCanJoin, isPending, onJoin, isLoading } = useJoinEvents({
    guestCnt,
  });

  if (isLoading) return null;

  if (!isCanJoin) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <p>참가 기한이 지났습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      {!isJoin && (
        <InputGuest
          guestCnt={guestCnt}
          setGuestCnt={setGuestCnt}
          isPending={isPending}
        />
      )}
      <PrimaryButton
        disabled={isPending || !isCanJoin}
        onClick={onJoin}
        className="inline-flex self-end gap-4 px-10 py-2 font-bold text-white bg-orange-600 rounded-lg text-nowrap disabled:opacity-50"
      >
        {!isPending && (isJoin ? "참가취소" : "참가하기")}
        {isPending && (
          <Spinner>
            <Spinner.Spin />
          </Spinner>
        )}
      </PrimaryButton>
    </div>
  );
};

interface InputGuestProps {
  guestCnt: number;
  setGuestCnt: (cnt: number) => void;
  isPending: boolean;
}

const InputGuest: React.FC<InputGuestProps> = ({
  guestCnt,
  setGuestCnt,
  isPending,
}) => {
  const readonly = isPending;
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setGuestCnt(Number(e.target.value));
    },
    [setGuestCnt]
  );

  // 포커스가 해제될때 0, 30으로 최대 최소값을 제한하는 함수
  const onBlur = useCallback(() => {
    const sorted = [0, guestCnt, 10].sort((a, b) => a - b);
    setGuestCnt(sorted[1]);
  }, [guestCnt, setGuestCnt]);

  return (
    <div className="inline-flex flex-col max-w-20">
      <label
        htmlFor={"guestCnt"}
        className="px-2 mb-1 text-sm text-gray-600 text-nowrap"
      >
        게스트 수
      </label>
      <input
        name={"guestCnt"}
        value={String(guestCnt)}
        onBlur={onBlur}
        readOnly={isPending}
        onChange={onChange}
        id={"guestCnt"}
        type="number"
        min={0}
        max={30}
        className={`p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 ${
          readonly &&
          "bg-gray-100 outline-none !focus:ring-0 border-none text-orange-500 font-bold !py-0"
        }`}
      />
    </div>
  );
};
