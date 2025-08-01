"use client";

import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { day_js } from "@/share/lib/dayjs";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useJoinEvents = ({
  guestCnt,
  confirmFn,
  withLoginConfirm = false,
}: {
  guestCnt: number;
  confirmFn?: (message: string) => Promise<boolean>;
  withLoginConfirm?: boolean;
}) => {
  const { own, needLoginPromise } = useNeedLogin();
  const { mutateAsync } = useMutation(eventsMutateOption.toggleJoin);
  const isMutating = useIsMutating(eventsMutateOption.toggleJoin) === 1;

  const { events, isJoin, isFetching, isLoading } = useFetchSelectedEvents();
  const eventsId = events?.id ?? "";
  const memberId = own?.id ?? "";

  const isPending = isMutating || isFetching;

  // events 기한이 지나면 참가하지 못한다.
  const isCanJoin =
    events && day_js().isSameOrBefore(day_js(events.timeSlot.end));

  const onJoin = useCallback(async () => {
    try {
      await needLoginPromise({ withConfirm: withLoginConfirm });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "LOGIN_CONFIRMATION_NEEDED"
      ) {
        // 로그인 확인이 필요한 경우 에러를 다시 던져서 상위에서 처리하도록 함
        throw error;
      }
      // 기존 로그인 리다이렉트의 경우
      console.log("로그인 페이지로 리다이렉트됨");
      return;
    }

    if (!memberId) return;
    if (!eventsId) return;
    if (isJoin) {
      const isConfirmed = confirmFn
        ? await confirmFn(
            "참가 취소시 게스트의 참가 기록과 함께 모두 삭제 됩니다.",
          )
        : window.confirm(
            "참가 취소시 게스트의 참가 기록과 함께 모두 삭제 됩니다.",
          );

      if (!isConfirmed) {
        return;
      }
    }

    await mutateAsync({ eventsId, memberId, guestCnt });
  }, [
    eventsId,
    guestCnt,
    isJoin,
    memberId,
    mutateAsync,
    needLoginPromise,
    confirmFn,
    withLoginConfirm,
  ]);

  return {
    onJoin,
    isJoin,
    isCanJoin,
    isLoading,
    isPending,
  };
};
