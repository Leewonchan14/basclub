import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export const JoinEventsButton = () => {
  const { own, needLoginPromise } = useNeedLogin();
  const { mutateAsync, isPending: isMutating } = useMutation({
    ...eventsMutateOption.toggleJoin,
  });
  const { events, isJoin, isFetching } = useFetchSelectedEvents();

  const isPending = isMutating || isFetching;

  return (
    <div className="flex items-center gap-6">
      <PrimaryButton
        disabled={isPending}
        onClick={async () => {
          await needLoginPromise();
          if (!own) return;
          if (!events) return;
          await mutateAsync({ eventsId: events.id, memberId: own.id! });
        }}
        className="inline-flex gap-4 px-10 py-2 font-bold text-white bg-orange-600 rounded-lg text-nowrap disabled:opacity-50"
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
