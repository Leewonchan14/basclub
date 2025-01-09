import { ERole } from "@/entity/enum/role";
import { memberQueryApi } from "@/feature/member/member-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchOwn = () => {
  const { data, isLoading } = useQuery(memberQueryApi.findOwn);
  return { own: data, isLoading, isAdmin: data?.role === ERole.ADMIN };
};
