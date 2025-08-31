import { PlainEvents } from "@/entity/event.entity";
import { PlainMember } from "@/entity/member.entity";
import { PlainTeam } from "@/entity/team.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import {
  changeLimitMem,
  removeEvent,
  toggleDone,
  toggleJoinEvent,
  upsertEvent,
} from "@/feature/events/events-mutate.action";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import { uuid } from "@/share/lib/uuid/uuid";
import { produce } from "immer";

export const eventsMutateOption = {
  upsert: {
    mutationKey: ["events", "upsert"],
    mutationFn: async (data: Partial<PlainEvents>) => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await upsertEvent(data));
        }, 2000);
      });
    },
    onSuccess: (_data: unknown, _variables: Partial<PlainEvents>) => {
      const queryClient = getQueryClient();

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  },

  toggleJoin: {
    mutationKey: ["events", "toggleJoin"],
    mutationFn: async ({
      eventsId,
      member,
      guestCnt,
    }: {
      eventsId: string;
      member: PlainMember;
      guestCnt: number;
    }) => toggleJoinEvent(eventsId, member.id, guestCnt),

    onMutate: (variables: {
      eventsId: string;
      member: PlainMember;
      guestCnt: number;
    }) => {
      getQueryClient().setQueryData(
        eventsQueryApi.findById(variables.eventsId, false).queryKey,
        (old) =>
          produce(old, (draft) => {
            if (!draft) return;
            const isJoinBefore = draft.teams.some(
              (t) => t.member.id === variables.member.id,
            );
            if (isJoinBefore) {
              draft.teams = draft.teams.filter(
                (t) => t.member.id !== variables.member.id,
              );
              return;
            }
            draft.teams = [
              ...(draft.teams ?? []),
              {
                id: uuid(),
                group: 0,
                avgScore: 0,
                isPaid: false,
                member: variables.member,
              },
            ];
            return;
          }),
      );
    },

    onSuccess: (
      data: PlainTeam[],
      variables: {
        eventsId: string;
        member: PlainMember;
        guestCnt: number;
      },
      _context: unknown,
    ) => {
      getQueryClient().setQueryData(
        eventsQueryApi.findById(variables.eventsId, false).queryKey,
        (old) =>
          produce(old, (draft) => {
            if (!draft) return;
            draft.teams = data;
          }),
      );
    },
  },

  toggleDone: {
    mutationKey: ["events", "toggleDone"],
    mutationFn: async (events: PlainEvents) => {
      return await toggleDone(events.id);
    },
    onMutate: (variables: PlainEvents) => {
      getQueryClient().setQueryData(
        eventsQueryApi.findById(variables.id, false).queryKey,
        (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;
            draft.isDone = !draft.isDone;
          }),
      );
    },
  },

  changeLimitMem: {
    mutationKey: ["events", "changeLimitMem"],
    mutationFn: async ({
      events,
      limitTeamCnt,
    }: {
      events: PlainEvents;
      limitTeamCnt: number;
    }) => {
      return changeLimitMem(events.id, limitTeamCnt);
    },
    onSuccess: (
      data: PlainEvents | undefined,
      variables: {
        events: PlainEvents;
        limitTeamCnt: number;
      },
      _context: unknown,
    ) => {
      if (!data) return;
      getQueryClient().setQueryData(
        eventsQueryApi.findById(variables.events.id, false).queryKey,
        data,
      );
    },
  },

  remove: {
    mutationKey: ["events", "remove"],
    mutationFn: async (id: string) => {
      return await removeEvent(id);
    },
    onSuccess: (_data: unknown, _variables: string) => {
      getQueryClient().invalidateQueries({
        queryKey: ["events"],
      });
    },
  },
};
