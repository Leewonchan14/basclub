import { useIsMutating, useMutation } from "@tanstack/react-query";
import { eventsMutateOption } from "../event-mutate";

export const useToggleDone = () => {
  const { mutateAsync } = useMutation(eventsMutateOption.toggleDone);
  const isMutating = useIsMutating(eventsMutateOption.toggleDone) === 1;

  return {
    toggleDone: mutateAsync,
    isPending: isMutating,
  };
};
