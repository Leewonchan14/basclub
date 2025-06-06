import { ERole } from "@/entity/enum/role";
import { memberQueryApi } from "@/feature/member/member-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchOwn = () => {
  const { data, isLoading } = useQuery(memberQueryApi.findOwn(true));
  const isMine = (id: string) => data?.id === id;
  const isCanUpdate = (id: string) =>
    data?.id === id || data?.role === ERole.ADMIN;
  return {
    own: data,
    isLoading,
    isAdmin: !isLoading && data?.role === ERole.ADMIN,
    isMine,
    isCanUpdate,
  };
};
