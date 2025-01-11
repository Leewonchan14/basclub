"use client";

import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useJoinEvents = ({ guestCnt }: { guestCnt: number }) => {
  const { own, needLoginPromise } = useNeedLogin();
  const { mutateAsync, isPending: isMutating } = useMutation({
    ...eventsMutateOption.toggleJoin,
  });

  const { events, isJoin, isFetching } = useFetchSelectedEvents();
  const eventsId = events?.id ?? "";
  const memberId = own?.id ?? 0;

  const isPending = isMutating || isFetching;

  const onJoin = useCallback(async () => {
    await needLoginPromise();
    if (!memberId) return;
    if (!eventsId) return;
    await mutateAsync({ eventsId, memberId, guestCnt });
  }, [eventsId, guestCnt, memberId, mutateAsync, needLoginPromise]);

  return {
    onJoin,
    isJoin,
    isPending,
  };
};
