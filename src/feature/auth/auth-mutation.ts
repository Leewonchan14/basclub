import { logout } from "@/feature/auth/auth-action";
import { memberQueryApi } from "@/feature/member/member-query";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const authMutateOption = {
  logout: {
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: memberQueryApi.findOwn(false).queryKey,
      });
    },
  },
};
