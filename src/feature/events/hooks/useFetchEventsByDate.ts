"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { teamsQueryApi } from "@/feature/team/team-query";
import { day_js } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useCallback } from "react";
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
    teamsQueryApi.findByEventsId(events?.id!, !!events),
  );

  const teamsArr = teamData ?? [];

  const teamsMap: { [k: string]: typeof teamsArr } = {
    ..._.groupBy(teamsArr, (t) => t.group),
  };

  let max = Math.max(...Object.keys(teamsMap).map((k) => Number(k)));
  max = Math.max(0, max);

  const notGroupedTeam = teamsMap[0] ?? [];
  const groupedTeam = _.range(max + 1)
    .map((_, i) => teamsMap[i] ?? [])
    .slice(1);

  const members = (teamsArr ?? []).map((t) => t.member);
  const ownGuestTeams = teamsArr.filter((t) => t.member.guestById === own?.id);
  const isJoin = members.some((m) => m.id === own?.id);

  // 이벤트의 일정시간에만 득점 기록 및 삭제 가능
  const isCanUpdateScore =
    events &&
    day_js().isBetween(
      day_js(events.timeSlot.start),
      day_js(events.date).endOf("day"),
    );

  const checkCanUpdateScore = useCallback(() => {
    if (!isCanUpdateScore) {
      alert("스탯 기록 및 삭제는 경기 시작 ~ 모임 종료 시간에만 가능합니다.");
    }

    return isCanUpdateScore;
  }, [isCanUpdateScore]);

  return {
    events,
    teamsMap,
    members,
    teamsArr,
    ownGuestTeams,
    notGroupedTeam,
    groupedTeam,
    isJoin,
    isCanUpdateScore,
    checkCanUpdateScore,
    isLoading:
      isLoadingExist ||
      isLoading ||
      isLoadingTeam ||
      isLoadingOwn ||
      isFetchingTeam ||
      isRefetchingTeam,
    isFetching: isFetching || isFetchingTeam || isRefetchingTeam,
    isRefetching: isRefetching || isRefetchingTeam,
  };
};
