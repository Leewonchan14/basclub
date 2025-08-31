"use client";

import { PlainTeam } from "@/entity/team.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { teamMutateOption } from "@/feature/team/team-mutate";
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

    const queryKey = eventsQueryApi.findById(events.id, false).queryKey;
    const previous = queryClient.getQueryData(queryKey);

    if (previous) {
      queryClient.setQueryData(queryKey, {
        ...previous,
        teams: previous.teams.map((team: PlainTeam) => ({
          ...team,
          isPaid: team.id === teamId ? !team.isPaid : team.isPaid,
        })),
      });
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
