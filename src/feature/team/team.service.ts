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
import { In, Repository } from "typeorm";

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
    return this.teamRepository.find({
      where: { events: { id: eventId } },
      order: {
        createdAt: "ASC",
      },
      relations: { events: true, member: true },
    });
  }

  async findTeamsByEventIdAndMemberId(eventId: string, memberId: string) {
    const findTeam = await this.teamRepository.findOne({
      where: { events: { id: eventId }, member: { id: memberId } },
    });

    return findTeam;
  }

  // TODO guestCnt 사용해야함
  async toggleJoin(eventId: string, memberId: string, guestCnt: number) {
    const findTeam = await this.findTeamsByEventIdAndMemberId(
      eventId,
      memberId
    );

    const { findMember, newGuests, guests } =
      await this.memberService.getMemberGuestByMemberIdAndCnt(
        memberId,
        guestCnt
      );

    // 이미 있다면 삭제
    if (findTeam) {
      await this.teamRepository.remove(findTeam);
      // team의 게스트들도 다 삭제
      await this.teamRepository.delete({
        member: { id: In(guests.map((g) => g.id)) },
      });

      // score들도 삭제
      await this.scoreService.deleteScoresByMemberIdAndEventsId(
        memberId,
        eventId
      );
      return;
    }

    const findEvent = await this.eventsService.findById(eventId);

    if (!findEvent) {
      return;
    }

    // 1. 본인 Team 생성
    const avgScore = await this.scoreService.findScoresAVGByMemberId(memberId);

    const ownTeam = this.teamRepository.create({
      group: 0,
      avgScore: avgScore ?? 0,
    });

    ownTeam.events = Promise.resolve(findEvent);
    ownTeam.member = findMember;

    // 2. 게스트들 Teams 생성

    const guestsTeams = newGuests.map((m) => {
      const newTeam = this.teamRepository.create({
        group: 0,
        avgScore: 0,
      });

      newTeam.events = Promise.resolve(findEvent);
      newTeam.member = m;

      return newTeam;
    });

    await this.teamRepository.save([ownTeam, ...guestsTeams]);
    return;
  }

  async upsertTeams(teams: PlainTeam[][]) {
    teams = teams.map((team, i) => team.map((t) => ({ ...t, group: i })));
    await this.teamRepository.upsert(teams.flat(), ["id"]);
  }
}
