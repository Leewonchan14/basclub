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
import { produce } from "immer";
import { teamsQueryApi } from "../team/team-query";
import { uuid } from "@/share/lib/uuid/uuid";

export const eventsMutateOption = {
  upsert: {
    mutationKey: ["events", "upsert"],
    mutationFn: async (data: Partial<PlainEvents>) => {
      return await upsertEvent(data);
    },
    onSuccess: (_data: unknown, _variables: Partial<PlainEvents>) => {
      getQueryClient().invalidateQueries({
        queryKey: [eventsQueryApi.findById("", false).queryKey[0]],
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
        teamsQueryApi.findByEventsId(variables.eventsId, false).queryKey,
        (old) => [
          ...(old ?? []),
          {
            id: uuid(),
            group: 0,
            avgScore: 0,
            isPaid: false,
            member: variables.member,
            guestCnt: variables.guestCnt,
          },
        ],
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
        teamsQueryApi.findByEventsId(variables.eventsId, false).queryKey,
        data,
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
