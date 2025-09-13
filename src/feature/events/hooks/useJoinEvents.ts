"use client";

import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { day_js } from "@/share/lib/dayjs";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { eventsQueryApi } from "../event-query";

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

  const { events, teamsArr, isJoin, isFetching, isLoading } =
    useFetchSelectedEvents();

  const eventsId = events?.id ?? "";

  const isPending = isMutating || isFetching;

  // events 기한이 지나거나 마감되면 참가하지 못한다.
  const isEventEnd =
    events &&
    (day_js(events.timeSlot.end).isSameOrBefore(day_js()) || events.isDone);

  const isEventLimit =
    events && teamsArr.length + guestCnt + 1 > events.limitTeamCnt;

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

    if (!own) return;
    if (!eventsId) return;
    if (isJoin) {
      const isConfirmed = await confirmFn?.(
        "참가 취소시 게스트의 참가 기록과 함께 모두 삭제 됩니다.",
      );

      if (!isConfirmed) {
        return;
      }
    }

    await mutateAsync({ eventsId, member: own, guestCnt });

    getQueryClient().invalidateQueries({
      ...eventsQueryApi.findById(eventsId, false),
    });
  }, [
    eventsId,
    isJoin,
    mutateAsync,
    own,
    guestCnt,
    needLoginPromise,
    withLoginConfirm,
    confirmFn,
  ]);

  return {
    onJoin,
    isJoin,
    isEventEnd,
    isEventLimit,
    isLoading,
    isPending,
  };
};
