import { PlainEvents } from "@/entity/event.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { day_js } from "@/share/lib/dayjs";
import { describe, expect, it, vi } from "vitest";

// react useCallback 모킹
vi.mock("react", () => ({
  useCallback: vi.fn(),
}));

vi.mock("@/feature/events/hooks/useFetchEvents");
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
  }),
  useIsMutating: vi.fn().mockReturnValue(0),
}));
vi.unmock("@/feature/events/hooks/useJoinEvents");

describe("useJoinEvents", () => {
  it("isDone이 true이고 이벤트 기한과 관련없이 isEventEnd가 true인지 확인", () => {
    // given
    const events: Partial<PlainEvents> = {
      isDone: true,
      timeSlot: {
        start: day_js().startOf("day").toISOString(),
        end: day_js().add(1, "day").toISOString(),
      },
    };

    const fetchedEvents = {
      events: events as unknown as PlainEvents,
      teamsArr: [],
      groupedTeam: [],
      isFetching: false,
      isJoin: false,
      isLoading: false,
      isRefetching: false,
      members: [],
      notGroupedTeam: [],
      ownGuestTeams: [],
      teamsMap: {},
    };

    vi.mocked(useFetchSelectedEvents).mockReturnValueOnce(fetchedEvents);

    const { isEventEnd: isEventEnd1 } = useJoinEvents({
      guestCnt: 0,
      confirmFn: vi.fn(),
      withLoginConfirm: false,
    });

    expect(isEventEnd1).toBe(true);

    vi.mocked(useFetchSelectedEvents).mockReturnValueOnce({
      ...fetchedEvents,
      events: {
        ...events,
        timeSlot: {
          ...events.timeSlot,
          end: day_js().subtract(1, "day").toISOString(),
        },
      } as unknown as PlainEvents,
    });

    const { isEventEnd: isEventEnd2 } = useJoinEvents({
      guestCnt: 0,
      confirmFn: vi.fn(),
      withLoginConfirm: false,
    });

    expect(isEventEnd2).toBe(true);
  });
});
