import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { teamsQueryApi } from "@/feature/team/team-query";
import { day_js } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { eventsQueryApi } from "../event-query";

export const useFetchSelectedEvents = () => {
  const { selectedDate } = useSelectedDate();

  const { eventsExists, isLoading: isLoadingExist } = useFetchEventsExist();

  const { own, isLoading: isLoadingOwn } = useFetchOwn();

  const key = day_js(selectedDate).format("YYYY-MM-DD");
  const enabled = !!(eventsExists && key in eventsExists);
  const eventsId = eventsExists?.[key];

  const {
    data: events,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery(eventsQueryApi.findById(eventsId!, enabled));

  const {
    data: teamData,
    isFetching: isFetchingTeam,
    isRefetching: isRefetchingTeam,
    isLoading: isLoadingTeam,
  } = useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    teamsQueryApi.findByEventsId(events?.id!, !!events)
  );

  const teamsArr = teamData ?? [];

  const teams: { [k: number]: typeof teamsArr } = {
    ..._.groupBy(teamsArr, (t) => t.group),
  };
  const notGroupedTeam = teams[0] ?? [];
  const groupedTeam = { ..._.omit(teams, "0") };

  const members = (teamsArr ?? []).map((t) => t.member);
  const isJoin = members.some((m) => m.id === own?.id);

  return {
    events,
    teams,
    members,
    teamsArr,
    notGroupedTeam,
    groupedTeam,
    isJoin,
    isLoading: isLoadingExist || isLoading || isLoadingTeam || isLoadingOwn,
    isFetching: isFetching || isFetchingTeam,
    isRefetching: isRefetching || isRefetchingTeam,
  };
};
