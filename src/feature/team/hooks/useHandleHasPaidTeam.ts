"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { teamMutateOption } from "@/feature/team/team-mutate";
import { teamsQueryApi } from "@/feature/team/team-query";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

export const useHandleHasPaidTeam = (teamId: string) => {
  const queryClient = useQueryClient(getQueryClient());
  const { needLoginPromise } = useNeedLogin();
  const { mutateAsync } = useMutation(teamMutateOption.toggleHasPaid(teamId));
  const { events } = useFetchSelectedEvents();
  const isMutating =
    useIsMutating(teamMutateOption.toggleHasPaid(teamId)) === 1;

  const handleTogglePaidTeam = useCallback(async () => {
    await needLoginPromise();
    if (!teamId) return;
    if (!events?.id) return;
    if (isMutating) return;

    const queryKey = teamsQueryApi.findByEventsId(events.id, false).queryKey;
    const previous = queryClient.getQueryData(queryKey);

    if (previous) {
      queryClient.setQueryData(
        queryKey,
        previous.map((team) => ({
          ...team,
          isPaid: team.id === teamId ? !team.isPaid : team.isPaid,
        })),
      );
    }

    await mutateAsync();
  }, [
    events?.id,
    isMutating,
    mutateAsync,
    needLoginPromise,
    queryClient,
    teamId,
  ]);

  return {
    handleTogglePaidTeam,
    isMutating,
  };
};
