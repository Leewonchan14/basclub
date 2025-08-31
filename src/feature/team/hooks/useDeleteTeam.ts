import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { teamMutateOption } from "@/feature/team/team-mutate";
import { teamsQueryApi } from "@/feature/team/team-query";
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

    const queryKey = teamsQueryApi.findByEventsId(events.id, false).queryKey;
    const previous = queryClient.getQueryData(queryKey);

    if (previous) {
      queryClient.setQueryData(
        queryKey,
        previous.filter((team) => team.id !== teamId),
      );
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
