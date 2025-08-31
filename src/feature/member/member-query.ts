import { usersApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const memberQueryApi = {
  findOwn: (enabled: boolean) =>
    queryOptions({
      queryKey: ["member", "own"],
      queryFn: () => usersApi.get("me").json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
  findById: (id: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["member", id],
      queryFn: () => usersApi.get(`${id}`).json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};
