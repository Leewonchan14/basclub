import { PlainTeam, Team } from "@/entity/team.entity";
import { EventsService } from "@/feature/events/events.service";
import { MemberService } from "@/feature/member/member.service";
import { ScoreService } from "@/feature/score/score.service";
import {
  IService,
  Inject,
  InjectRepository,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Repository } from "typeorm";

@Service
export class TeamService implements IService<Team> {
  @InjectRepository(Team)
  private teamRepository: Repository<Team>;

  @Inject(EventsService)
  private eventsService: EventsService;

  @Inject(MemberService)
  private memberService: MemberService;

  @Inject(ScoreService)
  private scoreService: ScoreService;

  async getRepository() {
    return this.teamRepository;
  }

  async findTeamsByEventId(eventId: string) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      throw new Error("Invalid eventId: eventId must be a non-empty string");
    }

    return this.teamRepository.find({
      where: { events: { id: eventId } },
      order: {
        createdAt: "ASC",
        member: {
          nickname: "ASC",
        },
      },
      relations: { events: true, member: true },
    });
  }

  async findTeamsByEventIdAndMemberId(eventId: string, memberId: string) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      throw new Error("Invalid eventId: eventId must be a non-empty string");
    }
    if (!memberId || typeof memberId !== 'string' || memberId.trim() === '') {
      throw new Error("Invalid memberId: memberId must be a non-empty string");
    }

    const findTeam = await this.teamRepository.findOne({
      where: { events: { id: eventId }, member: { id: memberId } },
    });

    return findTeam;
  }

  async toggleJoin(eventId: string, memberId: string, guestCnt: number) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      throw new Error("Invalid eventId: eventId must be a non-empty string");
    }
    if (!memberId || typeof memberId !== 'string' || memberId.trim() === '') {
      throw new Error("Invalid memberId: memberId must be a non-empty string");
    }
    if (typeof guestCnt !== 'number' || guestCnt < 0 || guestCnt > 9) {
      throw new Error("Invalid guestCnt: guestCnt must be a number between 0 and 9");
    }

    const findTeam = await this.findTeamsByEventIdAndMemberId(
      eventId,
      memberId,
    );

    const findEvent = await this.eventsService.findById(eventId);
    if (!findEvent) {
      throw new Error("Event not found");
    }

    // 이미 있다면 삭제
    if (findTeam) {
      await this.removeJoin(eventId, memberId);
      return this.findTeamsByEventId(eventId);
    }

    const { originMember, members } =
      await this.memberService.generateOriginMemberGuest(memberId, guestCnt);

    // 평균 점수 구하기
    const avgScore = await this.scoreService.findScoresAVGByMemberId(
      originMember.id,
    );

    const newTeams = members.map((m) => {
      const newTeam = this.teamRepository.create({
        group: 0,
        avgScore: 0,
      });

      newTeam.events = Promise.resolve(findEvent);
      newTeam.member = m;
      if (m.id === originMember.id) {
        newTeam.avgScore = avgScore ?? 0;
      }
      return newTeam;
    });

    return this.teamRepository.save(newTeams);
  }

  // 참가 취소
  async removeJoin(eventId: string, memberId: string) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
      throw new Error("Invalid eventId: eventId must be a non-empty string");
    }
    if (!memberId || typeof memberId !== 'string' || memberId.trim() === '') {
      throw new Error("Invalid memberId: memberId must be a non-empty string");
    }

    const findMember = await this.memberService.findById(memberId);

    if (!findMember) {
      throw new Error("Member not found");
    }

    const originMemberId = findMember.guestBy || findMember.id;

    // 이벤트에 team모두 삭제
    const teams = await this.teamRepository.findBy({
      events: { id: eventId },
      member: [{ id: originMemberId }, { guestBy: originMemberId }],
    });

    await this.teamRepository.remove(teams);

    // 이벤트에 score모두 삭제
    await this.scoreService.deleteScoresByEventsIdAndMemberId(
      eventId,
      originMemberId,
    );
    return;
  }

  async upsertTeams(teams: PlainTeam[][]) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!teams || !Array.isArray(teams)) {
      throw new Error("Invalid teams: teams must be an array");
    }
    if (teams.length === 0) {
      throw new Error("Invalid teams: teams array cannot be empty");
    }

    teams = teams.map((team, i) => team.map((t) => ({ ...t, group: i })));
    await this.teamRepository.upsert(teams.flat(), ["id"]);
  }

  async togglePaidTeam(teamId: string) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!teamId || typeof teamId !== 'string' || teamId.trim() === '') {
      throw new Error("Invalid teamId: teamId must be a non-empty string");
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error("Team not found");
    }
    team.isPaid = !team.isPaid;
    await this.teamRepository.save(team);
    return team;
  }

  async deleteTeam(teamId: string) {
    // 🛡️ 입력값 검증 (방어 코드)
    if (!teamId || typeof teamId !== 'string' || teamId.trim() === '') {
      throw new Error("Invalid teamId: teamId must be a non-empty string");
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error("Team not found");
    }
    await this.teamRepository.remove(team);
    return team;
  }
}
