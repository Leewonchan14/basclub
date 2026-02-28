import { ERole } from "@/entity/enum/role";
import { memberQueryApi } from "@/feature/member/member-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchOwn = () => {
  const {
    data: own,
    isLoading,
    isFetching,
  } = useQuery(memberQueryApi.findOwn(true));

  return {
    own,
    isLoading: isLoading || isFetching,
    isAdmin: !isLoading && own?.role === ERole.ADMIN,
  };
};
