import {
  getEventByDate,
  getEventsExistInMonth,
} from "@/feature/events/event-query.action";
import { teamsQueryApi } from "@/feature/team/team-query";
import { day_js, Dayjs } from "@/share/lib/dayjs";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const eventsQueryApi = {
  findByDate: (date: Dayjs, enabled: boolean) =>
    queryOptions({
      queryKey: ["events", date.format("YYYY-MM-DD")],
      queryFn: async () => {
        return await getEventByDate(date.toISOString());
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),

  findByMonthExist: (date: Dayjs, enabled: boolean) =>
    queryOptions({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ["events", date.format("YYYY-MM")],
      queryFn: async () => {
        if (!date) return {};
        return await getEventsExistInMonth(date.toISOString());
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};

export const useFetchEventsByDate = (selectedDate: Dayjs | undefined) => {
  const { data: eventsExists, isLoading: isLoadingExist } = useQuery(
    eventsQueryApi.findByMonthExist(day_js(selectedDate), !!selectedDate)
  );
  const { data: events, isLoading } = useQuery(
    eventsQueryApi.findByDate(
      day_js(selectedDate),
      !!(
        eventsExists &&
        day_js(selectedDate).format("YYYY-MM-DD") in eventsExists
      )
    )
  );

  const { data: teams, isLoading: isLoadingTeam } = useQuery(
    teamsQueryApi.findByEventsId(events?.id!, !!events)
  );

  const members = Object.values(teams ?? {}).flat();

  return {
    events,
    teams,
    members,
    isLoading: isLoadingExist || isLoading || isLoadingTeam,
  };
};
