import {
  memberFindById,
  memberOwn,
} from "@/feature/member/member-query.actions";
import { queryOptions } from "@tanstack/react-query";

export const memberQueryApi = {
  findOwn: queryOptions({
    queryKey: ["member", "own"],
    queryFn: async () => {
      return memberOwn();
    },
    staleTime: 1000 * 30,
  }),

  findById: (id: number) =>
    queryOptions({
      queryKey: ["member", id],
      queryFn: () => {
        return memberFindById(id);
      },
      staleTime: 1000 * 60 * 60 * 24,
    }),
};
