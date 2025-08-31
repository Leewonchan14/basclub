import { Events } from "@/entity/event.entity";
import { Member } from "@/entity/member.entity";
import { Team } from "@/entity/team.entity";
import { EventsService } from "@/feature/events/events.service";
import { MemberService } from "@/feature/member/member.service";
import { ScoreService } from "@/feature/score/score.service";
import { TeamService } from "@/feature/team/team.service";
import { Repository } from "typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/feature/events/events.service");
vi.mock("@/feature/member/member.service");
vi.mock("@/feature/score/score.service");

describe("TeamService", () => {
  let teamService: TeamService;
  let mockTeamRepository: Partial<Repository<Team>>;
  let mockEventsService: Partial<EventsService>;
  let mockMemberService: Partial<MemberService>;
  let mockScoreService: Partial<ScoreService>;

  beforeEach(() => {
    // Repository 모킹
    mockTeamRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      findBy: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
      upsert: vi.fn(),
    };

    // Service 모킹
    mockEventsService = {
      findById: vi.fn(),
    };

    mockMemberService = {
      findById: vi.fn(),
      generateOriginMemberGuest: vi.fn(),
    };

    mockScoreService = {
      findScoresAVGByMemberId: vi.fn(),
      deleteScoresByEventsIdAndMemberId: vi.fn(),
    };

    // TeamService 인스턴스 생성
    teamService = new TeamService();

    // private 프로퍼티 주입 (readonly 프로퍼티를 위해 defineProperty 사용)
    Object.defineProperty(teamService, "teamRepository", {
      value: mockTeamRepository,
      writable: true,
    });
    Object.defineProperty(teamService, "eventsService", {
      value: mockEventsService,
      writable: true,
    });
    Object.defineProperty(teamService, "memberService", {
      value: mockMemberService,
      writable: true,
    });
    Object.defineProperty(teamService, "scoreService", {
      value: mockScoreService,
      writable: true,
    });
  });

  describe("findTeamsByEventId", () => {
    it("이벤트 ID로 팀을 조회해야 한다", async () => {
      // given
      const eventId = "event-1";
      const mockTeams = [
        { id: "team-1", events: { id: eventId }, member: { id: "member-1" } },
        { id: "team-2", events: { id: eventId }, member: { id: "member-2" } },
      ] as unknown as Team[];

      vi.mocked(mockTeamRepository.find!).mockResolvedValue(mockTeams);

      // when
      const result = await teamService.findTeamsByEventId(eventId);

      // then
      expect(mockTeamRepository.find).toHaveBeenCalledWith({
        where: { events: { id: eventId } },
        order: {
          createdAt: "ASC",
          member: {
            nickname: "ASC",
          },
        },
        relations: { events: true, member: true },
      });
      expect(result).toEqual(mockTeams);
    });
  });

  describe("findTeamsByEventIdAndMemberId", () => {
    it("이벤트 ID와 멤버 ID로 팀을 조회해야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "member-1";
      const mockTeam = { id: "team-1" } as Team;

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(mockTeam);

      // when
      const result = await teamService.findTeamsByEventIdAndMemberId(
        eventId,
        memberId,
      );

      // then
      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { events: { id: eventId }, member: { id: memberId } },
      });
      expect(result).toEqual(mockTeam);
    });
  });

  describe("toggleJoin", () => {
    it("이미 참가한 팀이 있으면 참가를 취소해야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "member-1";
      const guestCnt = 0;
      const mockTeam = { id: "team-1" } as Team;
      const mockEvent = { id: eventId } as Events;
      const mockRemainingTeams = [{ id: "team-2" }] as Team[];

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(mockTeam);
      vi.mocked(mockEventsService.findById!).mockResolvedValue(mockEvent);

      // removeJoin 메서드 스파이
      const removeJoinSpy = vi
        .spyOn(teamService, "removeJoin")
        .mockResolvedValue();
      const findTeamsByEventIdSpy = vi
        .spyOn(teamService, "findTeamsByEventId")
        .mockResolvedValue(mockRemainingTeams);

      // when
      const result = await teamService.toggleJoin(eventId, memberId, guestCnt);

      // then
      expect(removeJoinSpy).toHaveBeenCalledWith(eventId, memberId);
      expect(findTeamsByEventIdSpy).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(mockRemainingTeams);
    });

    it("참가한 팀이 없으면 새로운 팀을 생성해야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "member-1";
      const guestCnt = 2;
      const mockEvent = { id: eventId } as Events;
      const mockOriginMember = { id: memberId } as Member;
      const mockMembers = [
        mockOriginMember,
        { id: "guest-1", guestBy: memberId } as Member,
        { id: "guest-2", guestBy: memberId } as Member,
      ];
      const avgScore = 85.5;
      const mockNewTeams = [
        { id: "new-team-1", group: 0, avgScore: avgScore },
        { id: "new-team-2", group: 0, avgScore: 0 },
        { id: "new-team-3", group: 0, avgScore: 0 },
      ] as Team[];

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(null);
      vi.mocked(mockEventsService.findById!).mockResolvedValue(mockEvent);
      vi.mocked(mockMemberService.generateOriginMemberGuest!).mockResolvedValue(
        {
          originMember: mockOriginMember,
          members: mockMembers,
          memberIds: mockMembers.map((m) => m.id),
        } as never,
      );
      vi.mocked(mockScoreService.findScoresAVGByMemberId!).mockResolvedValue(
        avgScore,
      );
      vi.mocked(mockTeamRepository.create!).mockImplementation(
        () => ({ id: `new-team-${Math.random()}` }) as Team,
      );
      vi.mocked(mockTeamRepository.save!).mockResolvedValue(
        mockNewTeams as never,
      );

      // when
      const result = await teamService.toggleJoin(eventId, memberId, guestCnt);

      // then
      expect(mockMemberService.generateOriginMemberGuest).toHaveBeenCalledWith(
        memberId,
        guestCnt,
      );
      expect(mockScoreService.findScoresAVGByMemberId).toHaveBeenCalledWith(
        memberId,
      );
      expect(mockTeamRepository.create).toHaveBeenCalledTimes(3);
      expect(mockTeamRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockNewTeams);
    });

    it("이벤트를 찾을 수 없으면 에러를 발생시켜야 한다", async () => {
      // given
      const eventId = "non-existent-event";
      const memberId = "member-1";
      const guestCnt = 0;

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(null);
      vi.mocked(mockEventsService.findById!).mockResolvedValue(null);

      // when & then
      await expect(
        teamService.toggleJoin(eventId, memberId, guestCnt),
      ).rejects.toThrow("Event not found");
    });

    // 버그 방지를 위한 추가 테스트 케이스들
    it("특정 멤버의 팀만 제거되고 다른 멤버의 팀은 보존되어야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "member-1";
      const guestCnt = 0;

      // 다른 멤버들의 팀이 존재하는 상황
      const otherMemberTeams = [
        {
          id: "team-other-1",
          events: { id: eventId },
          member: { id: "other-member-1" },
        },
        {
          id: "team-other-2",
          events: { id: eventId },
          member: { id: "other-member-2" },
        },
      ] as unknown as Team[];

      const currentMemberTeam = {
        id: "team-current",
        events: { id: eventId },
        member: { id: memberId },
      } as unknown as Team;
      const mockEvent = { id: eventId } as Events;

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(
        currentMemberTeam,
      );
      vi.mocked(mockEventsService.findById!).mockResolvedValue(mockEvent);

      const removeJoinSpy = vi
        .spyOn(teamService, "removeJoin")
        .mockResolvedValue();
      vi.spyOn(teamService, "findTeamsByEventId").mockResolvedValue(
        otherMemberTeams,
      );

      // when
      const result = await teamService.toggleJoin(eventId, memberId, guestCnt);

      // then
      expect(removeJoinSpy).toHaveBeenCalledWith(eventId, memberId);
      expect(result).toEqual(otherMemberTeams);
      // 다른 멤버의 팀들은 그대로 남아있어야 함
      expect(result).toHaveLength(2);
      expect(
        result.every(
          (team) =>
            (team as unknown as { member: { id: string } }).member.id !==
            memberId,
        ),
      ).toBe(true);
    });

    it("동시에 여러 멤버가 참가 취소해도 각각의 팀만 제거되어야 한다", async () => {
      // given
      const eventId = "event-1";
      const member1Id = "member-1";
      const member2Id = "member-2";
      const mockEvent = { id: eventId } as Events;

      // 각각 다른 팀에 참가한 상황
      const member1Team = { id: "team-1", member: { id: member1Id } } as Team;
      const member2Team = { id: "team-2", member: { id: member2Id } } as Team;

      vi.mocked(mockEventsService.findById!).mockResolvedValue(mockEvent);

      // member1의 toggleJoin 테스트
      vi.mocked(mockTeamRepository.findOne!).mockResolvedValueOnce(member1Team);
      const removeJoinSpy1 = vi
        .spyOn(teamService, "removeJoin")
        .mockResolvedValueOnce();
      vi.spyOn(teamService, "findTeamsByEventId").mockResolvedValueOnce([
        member2Team,
      ]); // member2의 팀은 남아있음

      // when - member1 참가 취소
      const result1 = await teamService.toggleJoin(eventId, member1Id, 0);

      // then
      expect(removeJoinSpy1).toHaveBeenCalledWith(eventId, member1Id);
      expect(result1).toEqual([member2Team]);
      expect(
        result1.some(
          (team) =>
            (team as unknown as { member: { id: string } }).member.id ===
            member2Id,
        ),
      ).toBe(true);
      expect(
        result1.some(
          (team) =>
            (team as unknown as { member: { id: string } }).member.id ===
            member1Id,
        ),
      ).toBe(false);
    });
  });

  describe("removeJoin", () => {
    it("멤버와 게스트들의 팀과 스코어를 삭제해야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "member-1";
      const mockMember = { id: memberId, guestBy: null } as unknown as Member;
      const mockTeams = [{ id: "team-1" }, { id: "team-2" }] as Team[];

      vi.mocked(mockMemberService.findById!).mockResolvedValue(mockMember);
      vi.mocked(mockTeamRepository.findBy!).mockResolvedValue(mockTeams);
      vi.mocked(mockTeamRepository.remove!).mockResolvedValue(
        mockTeams as never,
      );
      vi.mocked(
        mockScoreService.deleteScoresByEventsIdAndMemberId!,
      ).mockResolvedValue(undefined as never);

      // when
      await teamService.removeJoin(eventId, memberId);

      // then
      expect(mockTeamRepository.findBy).toHaveBeenCalledWith({
        events: { id: eventId },
        member: [{ id: memberId }, { guestBy: memberId }],
      });
      expect(mockTeamRepository.remove).toHaveBeenCalledWith(mockTeams);
      expect(
        mockScoreService.deleteScoresByEventsIdAndMemberId,
      ).toHaveBeenCalledWith(eventId, memberId);
    });

    it("멤버를 찾을 수 없으면 에러를 발생시켜야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = "non-existent-member";

      vi.mocked(mockMemberService.findById!).mockResolvedValue(null);

      // when & then
      await expect(teamService.removeJoin(eventId, memberId)).rejects.toThrow(
        "Member not found",
      );
    });

    it("게스트 멤버의 경우 원래 멤버 ID로 삭제해야 한다", async () => {
      // given
      const eventId = "event-1";
      const guestMemberId = "guest-1";
      const originMemberId = "member-1";
      const mockGuestMember = {
        id: guestMemberId,
        guestBy: originMemberId,
      } as Member;
      const mockTeams = [{ id: "team-1" }] as Team[];

      vi.mocked(mockMemberService.findById!).mockResolvedValue(mockGuestMember);
      vi.mocked(mockTeamRepository.findBy!).mockResolvedValue(mockTeams);
      vi.mocked(mockTeamRepository.remove!).mockResolvedValue(
        mockTeams as never,
      );
      vi.mocked(
        mockScoreService.deleteScoresByEventsIdAndMemberId!,
      ).mockResolvedValue(undefined as never);

      // when
      await teamService.removeJoin(eventId, guestMemberId);

      // then
      expect(mockTeamRepository.findBy).toHaveBeenCalledWith({
        events: { id: eventId },
        member: [{ id: originMemberId }, { guestBy: originMemberId }],
      });
      expect(
        mockScoreService.deleteScoresByEventsIdAndMemberId,
      ).toHaveBeenCalledWith(eventId, originMemberId);
    });

    // 버그 방지를 위한 추가 테스트
    it("특정 멤버의 팀만 삭제하고 다른 멤버의 팀은 영향받지 않아야 한다", async () => {
      // given
      const eventId = "event-1";
      const targetMemberId = "target-member";
      const otherMemberId = "other-member";

      const mockTargetMember = {
        id: targetMemberId,
        guestBy: null,
      } as unknown as Member;
      const targetTeams = [
        { id: "target-team-1", member: { id: targetMemberId } },
        {
          id: "target-guest-team",
          member: { id: "guest-1", guestBy: targetMemberId },
        },
      ] as Team[];

      vi.mocked(mockMemberService.findById!).mockResolvedValue(
        mockTargetMember,
      );
      vi.mocked(mockTeamRepository.findBy!).mockResolvedValue(targetTeams);
      vi.mocked(mockTeamRepository.remove!).mockResolvedValue(
        targetTeams as never,
      );
      vi.mocked(
        mockScoreService.deleteScoresByEventsIdAndMemberId!,
      ).mockResolvedValue(undefined as never);

      // when
      await teamService.removeJoin(eventId, targetMemberId);

      // then
      expect(mockTeamRepository.findBy).toHaveBeenCalledWith({
        events: { id: eventId },
        member: [{ id: targetMemberId }, { guestBy: targetMemberId }],
      });
      // 정확히 타겟 멤버의 팀들만 조회되었는지 확인
      expect(mockTeamRepository.findBy).not.toHaveBeenCalledWith({
        events: { id: eventId },
        member: [{ id: otherMemberId }, { guestBy: otherMemberId }],
      });
      expect(mockTeamRepository.remove).toHaveBeenCalledWith(targetTeams);
      expect(
        mockScoreService.deleteScoresByEventsIdAndMemberId,
      ).toHaveBeenCalledWith(eventId, targetMemberId);
    });
  });

  describe("upsertTeams", () => {
    it("팀 배열을 그룹별로 업서트해야 한다", async () => {
      // given
      const teams = [
        [
          { id: "team-1", group: 0 },
          { id: "team-2", group: 0 },
        ],
        [
          { id: "team-3", group: 1 },
          { id: "team-4", group: 1 },
        ],
      ] as never;

      const expectedFlatTeams = [
        { id: "team-1", group: 0 },
        { id: "team-2", group: 0 },
        { id: "team-3", group: 1 },
        { id: "team-4", group: 1 },
      ];

      vi.mocked(mockTeamRepository.upsert!).mockResolvedValue({} as never);

      // when
      await teamService.upsertTeams(teams);

      // then
      expect(mockTeamRepository.upsert).toHaveBeenCalledWith(
        expectedFlatTeams,
        ["id"],
      );
    });
  });

  describe("togglePaidTeam", () => {
    it("팀의 결제 상태를 토글해야 한다", async () => {
      // given
      const teamId = "team-1";
      const mockTeam = { id: teamId, isPaid: false } as Team;

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(mockTeam);
      vi.mocked(mockTeamRepository.save!).mockResolvedValue({
        ...mockTeam,
        isPaid: true,
      } as never);

      // when
      const result = await teamService.togglePaidTeam(teamId);

      // then
      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamId },
      });
      expect(mockTeam.isPaid).toBe(true);
      expect(mockTeamRepository.save).toHaveBeenCalledWith(mockTeam);
      expect((result as unknown as { isPaid: boolean }).isPaid).toBe(true);
    });

    it("팀을 찾을 수 없으면 에러를 발생시켜야 한다", async () => {
      // given
      const teamId = "non-existent-team";

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(null);

      // when & then
      await expect(teamService.togglePaidTeam(teamId)).rejects.toThrow(
        "Team not found",
      );
    });
  });

  describe("deleteTeam", () => {
    it("팀을 삭제해야 한다", async () => {
      // given
      const teamId = "team-1";
      const mockTeam = { id: teamId } as Team;

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(mockTeam);
      vi.mocked(mockTeamRepository.remove!).mockResolvedValue(
        mockTeam as never,
      );

      // when
      const result = await teamService.deleteTeam(teamId);

      // then
      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamId },
      });
      expect(mockTeamRepository.remove).toHaveBeenCalledWith(mockTeam);
      expect(result).toEqual(mockTeam);
    });

    it("팀을 찾을 수 없으면 에러를 발생시켜야 한다", async () => {
      // given
      const teamId = "non-existent-team";

      vi.mocked(mockTeamRepository.findOne!).mockResolvedValue(null);

      // when & then
      await expect(teamService.deleteTeam(teamId)).rejects.toThrow(
        "Team not found",
      );
    });
  });

  // 🛡️ DEFENSIVE VALIDATION TESTS
  describe("입력값 검증 테스트", () => {
    describe("findTeamsByEventId 입력값 검증", () => {
      it("eventId가 undefined이면 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.findTeamsByEventId(undefined as any),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("eventId가 빈 문자열이면 에러를 발생시켜야 한다", async () => {
        await expect(teamService.findTeamsByEventId("")).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("eventId가 공백만 있으면 에러를 발생시켜야 한다", async () => {
        await expect(teamService.findTeamsByEventId("   ")).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("eventId가 null이면 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.findTeamsByEventId(null as any),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });
    });

    describe("findTeamsByEventIdAndMemberId 입력값 검증", () => {
      it("eventId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.findTeamsByEventIdAndMemberId(
            undefined as any,
            "member-1",
          ),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("memberId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.findTeamsByEventIdAndMemberId(
            "event-1",
            undefined as any,
          ),
        ).rejects.toThrow(
          "Invalid memberId: memberId must be a non-empty string",
        );
      });

      it("둘 다 잘못된 경우 eventId 에러를 먼저 발생시켜야 한다", async () => {
        await expect(
          teamService.findTeamsByEventIdAndMemberId(
            undefined as any,
            undefined as any,
          ),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });
    });

    describe("toggleJoin 입력값 검증", () => {
      it("eventId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.toggleJoin(undefined as any, "member-1", 0),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("memberId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.toggleJoin("event-1", undefined as any, 0),
        ).rejects.toThrow(
          "Invalid memberId: memberId must be a non-empty string",
        );
      });

      it("guestCnt가 음수면 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.toggleJoin("event-1", "member-1", -1),
        ).rejects.toThrow(
          "Invalid guestCnt: guestCnt must be a number between 0 and 9",
        );
      });

      it("guestCnt가 9를 초과하면 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.toggleJoin("event-1", "member-1", 10),
        ).rejects.toThrow(
          "Invalid guestCnt: guestCnt must be a number between 0 and 9",
        );
      });

      it("guestCnt가 문자열이면 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.toggleJoin("event-1", "member-1", "invalid" as any),
        ).rejects.toThrow(
          "Invalid guestCnt: guestCnt must be a number between 0 and 9",
        );
      });
    });

    describe("removeJoin 입력값 검증", () => {
      it("eventId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.removeJoin(undefined as any, "member-1"),
        ).rejects.toThrow(
          "Invalid eventId: eventId must be a non-empty string",
        );
      });

      it("memberId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.removeJoin("event-1", undefined as any),
        ).rejects.toThrow(
          "Invalid memberId: memberId must be a non-empty string",
        );
      });
    });

    describe("upsertTeams 입력값 검증", () => {
      it("teams가 배열이 아니면 에러를 발생시켜야 한다", async () => {
        await expect(teamService.upsertTeams(undefined as any)).rejects.toThrow(
          "Invalid teams: teams must be an array",
        );
      });

      it("teams가 빈 배열이면 에러를 발생시켜야 한다", async () => {
        await expect(teamService.upsertTeams([])).rejects.toThrow(
          "Invalid teams: teams array cannot be empty",
        );
      });
    });

    describe("togglePaidTeam 입력값 검증", () => {
      it("teamId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(
          teamService.togglePaidTeam(undefined as any),
        ).rejects.toThrow("Invalid teamId: teamId must be a non-empty string");
      });

      it("teamId가 빈 문자열이면 에러를 발생시켜야 한다", async () => {
        await expect(teamService.togglePaidTeam("")).rejects.toThrow(
          "Invalid teamId: teamId must be a non-empty string",
        );
      });
    });

    describe("deleteTeam 입력값 검증", () => {
      it("teamId가 잘못된 경우 에러를 발생시켜야 한다", async () => {
        await expect(teamService.deleteTeam(undefined as any)).rejects.toThrow(
          "Invalid teamId: teamId must be a non-empty string",
        );
      });
    });
  });

  // 🚨 CRITICAL BUG PREVENTION TESTS
  describe("memberId가 undefined일 때 버그 방지", () => {
    it("toggleJoin에서 memberId가 undefined이면 에러를 발생시켜야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = undefined as unknown as string;
      const guestCnt = 0;

      // when & then
      await expect(
        teamService.toggleJoin(eventId, memberId, guestCnt),
      ).rejects.toThrow();
    });

    it("removeJoin에서 memberId가 undefined이면 에러를 발생시켜야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = undefined as unknown as string;

      // when & then
      await expect(teamService.removeJoin(eventId, memberId)).rejects.toThrow();
    });

    it("findTeamsByEventIdAndMemberId에서 memberId가 undefined이면 방어 코드로 에러를 발생시켜야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = undefined as unknown as string;

      // when & then - 🛡️ 방어 코드가 작동해서 에러 발생
      await expect(
        teamService.findTeamsByEventIdAndMemberId(eventId, memberId),
      ).rejects.toThrow(
        "Invalid memberId: memberId must be a non-empty string",
      );

      // 중요: 위험한 쿼리가 실행되지 않음
      expect(mockTeamRepository.findOne).not.toHaveBeenCalled();
    });

    it("CRITICAL: memberId undefined 시 이벤트의 모든 팀이 삭제되지 않아야 한다", async () => {
      // given
      const eventId = "event-1";
      const memberId = undefined as unknown as string;

      // when & then - 🛡️ 방어 코드가 먼저 작동해서 더 안전한 에러 발생
      await expect(teamService.removeJoin(eventId, memberId)).rejects.toThrow(
        "Invalid memberId: memberId must be a non-empty string",
      );

      // 중요: 모든 위험한 로직이 실행되지 않음
      expect(mockMemberService.findById).not.toHaveBeenCalled();
      expect(mockTeamRepository.findBy).not.toHaveBeenCalled();
      expect(mockTeamRepository.remove).not.toHaveBeenCalled();
    });
  });
});
