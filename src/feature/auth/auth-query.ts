import { authApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const authQueryApi = {
  getToken: () =>
    queryOptions({
      queryKey: ["auth", "token"],
      queryFn: () => authApi.get("token").json(),
      staleTime: 1000 * 60 * 30,
    }),
  getPayload: () =>
    queryOptions({
      queryKey: ["auth", "payload"],
      queryFn: () => authApi.get("payload").json(),
      staleTime: 1000 * 60 * 30,
    }),
  getIsAdmin: () =>
    queryOptions({
      queryKey: ["auth", "is-admin"],
      queryFn: () => authApi.get("is-admin").json(),
      staleTime: 1000 * 60 * 30,
    }),
};
