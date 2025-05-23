"use client";

import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { day_js } from "@/share/lib/dayjs";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useJoinEvents = ({ guestCnt }: { guestCnt: number }) => {
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
    await needLoginPromise();
    if (!memberId) return;
    if (!eventsId) return;
    if (
      isJoin &&
      !window.confirm("참가 취소시 게스트와 기록된 스탯 모두 삭제 됩니다.")
    ) {
      return;
    }

    await mutateAsync({ eventsId, memberId, guestCnt });
  }, [eventsId, guestCnt, isJoin, memberId, mutateAsync, needLoginPromise]);

  return {
    onJoin,
    isJoin,
    isCanJoin,
    isLoading,
    isPending,
  };
};
