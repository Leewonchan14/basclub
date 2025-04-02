"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { Spinner } from "flowbite-react";
import { ChangeEvent, useCallback, useState } from "react";

export const JoinEventsButton = () => {
  const [guestCnt, setGuestCnt] = useState<number>(0);

  const { ownGuestTeams } = useFetchSelectedEvents();
  const { isJoin, isCanJoin, isPending, onJoin, isLoading } = useJoinEvents({
    guestCnt,
  });

  if (isLoading || isPending)
    return (
      <div className="flex w-full justify-center">
        <Spinner color="warning" />
      </div>
    );

  if (!isCanJoin) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-40 flex-col items-center justify-center text-gray-500">
          <p>참가 기한이 지났습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full items-center gap-2">
      <InputGuest
        className="h-full w-full"
        guestCnt={guestCnt}
        setGuestCnt={setGuestCnt}
        disabled={isPending || isJoin}
      />
      <PrimaryButton
        className="flex h-full w-full flex-col font-semibold"
        disabled={isPending || !isCanJoin}
        onClick={onJoin}
      >
        <div>{isJoin ? ownGuestTeams.length : guestCnt}명의 게스트와</div>
        <div>{isJoin ? "참가취소" : "참가하기"}</div>
      </PrimaryButton>
    </div>
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
  const readonly = disabled;
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setGuestCnt(Number(e.target.value));
    },
    [setGuestCnt],
  );

  // 포커스가 해제될때 0, 30으로 최대 최소값을 제한하는 함수
  const onBlur = useCallback(() => {
    const sorted = [0, guestCnt, 9].sort((a, b) => a - b);
    setGuestCnt(sorted[1]);
  }, [guestCnt, setGuestCnt]);

  return (
    <div
      className={`flex items-center ${className} ${disabled && "invisible"}`}
    >
      <MinusButton
        disabled={readonly}
        className={`${disabled && "cursor-not-allowed"}`}
        onClick={() => setGuestCnt(guestCnt - 1)}
      />
      <input
        type="text"
        id="quantity-input"
        data-input-counter
        aria-describedby="helper-text-explanation"
        className="block h-11 w-full min-w-10 border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        value={guestCnt}
        onChange={onChange}
        onBlur={onBlur}
        disabled={readonly}
      />
      <PlusButton
        disabled={readonly}
        className={`${disabled && "cursor-not-allowed"}`}
        onClick={() => setGuestCnt(guestCnt + 1)}
      />
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  className?: string;
  disabled: boolean;
}

const MinusButton = ({ onClick, className, disabled }: ButtonProps) => {
  return (
    <button
      type="button"
      id="decrement-button"
      className={`h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="h-3 w-3 text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 2"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h16"
        />
      </svg>
    </button>
  );
};

const PlusButton = ({ onClick, className, disabled }: ButtonProps) => {
  return (
    <button
      type="button"
      id="increment-button"
      className={`h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="h-3 w-3 text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 18"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 1v16M1 9h16"
        />
      </svg>
    </button>
  );
};
