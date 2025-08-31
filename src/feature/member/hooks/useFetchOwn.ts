import { memberQueryApi } from "@/feature/member/member-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchOwn = () => {
  const { data: own, isLoading } = useQuery(memberQueryApi.findOwn(true));

  return { own, isLoading };
};
