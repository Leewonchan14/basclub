import { useIsMutating, useMutation } from "@tanstack/react-query";
import { eventsMutateOption } from "../event-mutate";

export const useChangeLimitMem = () => {
  const { mutateAsync } = useMutation(eventsMutateOption.changeLimitMem);
  const isMutating = useIsMutating(eventsMutateOption.changeLimitMem) === 1;

  return {
    changeLimitMem: mutateAsync,
    isPending: isMutating,
  };
};
