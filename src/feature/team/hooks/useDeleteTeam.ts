import { PlainTeam } from "@/entity/team.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { teamMutateOption } from "@/feature/team/team-mutate";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

export const useDeleteTeam = (
  teamId: string,
  confirmFn?: (message: string) => Promise<boolean>,
) => {
  const { isAdmin } = useFetchOwn();
  const queryClient = useQueryClient(getQueryClient());
  const { events } = useFetchSelectedEvents();
  const { mutateAsync } = useMutation(teamMutateOption.deleteTeam(teamId));
  const isMutating = useIsMutating(teamMutateOption.deleteTeam(teamId)) === 1;

  const handleDeleteTeam = useCallback(async () => {
    if (!isAdmin) return;
    if (!events?.id) return;
    if (isMutating) return;

    const isConfirm = confirmFn
      ? await confirmFn("삭제하시겠습니까?")
      : window.confirm("삭제하시겠습니까?");

    if (!isConfirm) return;

    const queryKey = eventsQueryApi.findById(events.id, false).queryKey;
    const previous = queryClient.getQueryData(queryKey);

    if (previous) {
      queryClient.setQueryData(queryKey, {
        ...previous,
        teams: previous.teams.filter((team: PlainTeam) => team.id !== teamId),
      });
    }

    await mutateAsync();
  }, [
    isAdmin,
    events?.id,
    isMutating,
    queryClient,
    mutateAsync,
    teamId,
    confirmFn,
  ]);

  return { isMutating, handleDeleteTeam };
};
