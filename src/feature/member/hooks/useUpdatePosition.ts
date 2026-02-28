import { useIsMutating, useMutation } from "@tanstack/react-query";
import { memberMutateOption } from "../member-mutation";

export const useUpdatePosition = (memberId?: string) => {
  const { mutate: updatePositions } = useMutation(
    memberMutateOption.updatePositions(memberId ?? ""),
  );

  const isPositionPending = useIsMutating({
    mutationKey: memberMutateOption.updatePositions(memberId ?? "").mutationKey,
  });

  return { updatePositions, isPositionPending: Boolean(isPositionPending) };
};
