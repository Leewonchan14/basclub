import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { teamsQueryApi } from "@/feature/team/team-query";
import { day_js } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import { eventsQueryApi } from "../event-query";

export const useFetchSelectedEvents = () => {
  const { selectedDate } = useSelectedDate();

  const { eventsExists, isLoading: isLoadingExist } = useFetchEventsExist();

  const key = day_js(selectedDate).format("YYYY-MM-DD");
  const enabled = !!(eventsExists && key in eventsExists);
  const eventsId = eventsExists?.[key];

  const { data: events, isLoading } = useQuery(
    eventsQueryApi.findById(eventsId!, enabled)
  );

  const { data: teams, isLoading: isLoadingTeam } = useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
