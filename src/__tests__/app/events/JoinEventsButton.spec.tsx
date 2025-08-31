import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { PlainEvents } from "@/entity/event.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { day_js } from "@/share/lib/dayjs";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/feature/events/hooks/useFetchEvents");
vi.mock("@/feature/events/hooks/useJoinEvents");

describe("JoinEventsButton", () => {
  it("참가 마감이면 참가 마감 문자 표시", () => {
    // given
    const events: Partial<PlainEvents> = {
      timeSlot: {
        start: day_js().startOf("day").toISOString(),
        end: day_js().endOf("day").toISOString(),
      },
    };

    vi.mocked(useFetchSelectedEvents).mockReturnValue({
      events: events as unknown as PlainEvents,
      teamsArr: [],
      ownGuestTeams: [],
      isJoin: false,
      isLoading: false,
      groupedTeam: [],
      isFetching: false,
      isRefetching: false,
      members: [],
      notGroupedTeam: [],
      teamsMap: {},
    });

    vi.mocked(useJoinEvents).mockReturnValue({
      onJoin: vi.fn(),
      isEventEnd: true,
      isEventLimit: false,
      isJoin: false,
      isLoading: false,
      isPending: false,
    });

    render(<JoinEventsButton />);
    expect(screen.getByText("참가 기한이 마감되었습니다.")).toBeDefined();
  });

  it("참가 가능하면 참가하기 버튼 표시", () => {
    // given
    const events: Partial<PlainEvents> = {
      timeSlot: {
        start: day_js().startOf("day").toISOString(),
        end: day_js().add(1, "day").toISOString(),
      },
    };

    vi.mocked(useFetchSelectedEvents).mockReturnValue({
      events: events as unknown as PlainEvents,
      teamsArr: [],
      ownGuestTeams: [],
      isJoin: false,
      isLoading: false,
      groupedTeam: [],
      isFetching: false,
      isRefetching: false,
      members: [],
      notGroupedTeam: [],
      teamsMap: {},
    });

    vi.mocked(useJoinEvents).mockReturnValue({
      onJoin: vi.fn(),
      isEventEnd: false,
      isEventLimit: false,
      isJoin: false,
      isLoading: false,
      isPending: false,
    });

    render(<JoinEventsButton />);
    expect(screen.getByText("참가하기")).toBeDefined();
  });
});

describe("JoinEvents GuestCnt", () => {
  beforeEach(() => {
    vi.mocked(useFetchSelectedEvents).mockReturnValue({
      events: {
        timeSlot: {
          start: day_js().startOf("day").toISOString(),
          end: day_js().add(1, "day").toISOString(),
        },
      } as unknown as PlainEvents,
      teamsArr: [],
      ownGuestTeams: [],
      isJoin: false,
      isLoading: false,
      groupedTeam: [],
      isFetching: false,
      isRefetching: false,
      members: [],
      notGroupedTeam: [],
      teamsMap: {},
    });

    vi.mocked(useJoinEvents).mockReturnValue({
      onJoin: vi.fn(),
      isEventEnd: false,
      isEventLimit: false,
      isJoin: false,
      isLoading: false,
      isPending: false,
    });
  });

  it("guestCnt 증가시 참가하기 버튼 text 변경", () => {
    // given

    // when
    render(<JoinEventsButton />);

    // 초기 상태 확인 (0명)
    expect(screen.getByText("0명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();

    // when plus button click
    const plusButton = screen.getByTestId("plus-button");
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    // then
    expect(screen.getByText("2명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();
  });

  it("guestCnt 감소시 참가하기 버튼 text 변경", () => {
    // given

    // when
    render(<JoinEventsButton />);

    // 초기 상태 확인 (0명)
    expect(screen.getByText("0명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();

    // when user type 3
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "3" } });

    // when minus button click
    const minusButton = screen.getByTestId("minus-button");
    fireEvent.click(minusButton);

    // then
    expect(screen.getByText("2명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();
  });

  it("guestCnt 최대값 9 초과시 최대값 9로 변경", () => {
    // given

    // when
    render(<JoinEventsButton />);

    // 초기 상태 확인 (0명)
    expect(screen.getByText("0명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();

    // when user type 14
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "14" } });

    // then max value is 9
    expect(screen.getByText("9명의 게스트와")).toBeDefined();
    expect(screen.getByText("참가하기")).toBeDefined();
  });
});
