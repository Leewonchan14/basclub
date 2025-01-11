import {
  getMemberById,
  getMemberOwn,
} from "@/feature/member/member-query.actions";
import { queryOptions } from "@tanstack/react-query";

export const memberQueryApi = {
  findOwn: queryOptions({
    queryKey: ["member", "own"],
    queryFn: async () => {
      return getMemberOwn();
    },
    staleTime: 1000 * 30,
  }),

  findById: (id: string) =>
    queryOptions({
      queryKey: ["member", id],
      queryFn: () => {
        return getMemberById(id);
      },
      staleTime: 1000 * 60 * 60 * 24,
    }),
};
