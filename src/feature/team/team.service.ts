import { Team } from "@/entity/team.entity";
import { EventsService } from "@/feature/events/events.service";
import { MemberService } from "@/feature/member/member.service";
import { ScoreService } from "@/feature/score/score.service";
import {
  Inject,
  InjectRepository,
  IService,
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
    return this.teamRepository.find({
      where: { events: { id: eventId } },
      order: {
        createdAt: "ASC",
      },
    });
  }

  async findTeamsByEventIdAndMemberId(eventId: string, memberId: number) {
    const findTeam = await this.teamRepository.findOne({
      where: { events: { id: eventId }, member: { id: memberId } },
    });

    return findTeam;
  }

  async toggleJoin(eventId: string, memberId: number) {
    const findTeam = await this.findTeamsByEventIdAndMemberId(
      eventId,
      memberId
    );

    // 이미 있다면 삭제
    if (findTeam) {
      await this.teamRepository.remove(findTeam);
      return;
    }

    const findEvent = await this.eventsService.findById(eventId);
    const findMember = await this.memberService.findById(memberId);

    if (!findEvent || !findMember) {
      return;
    }

    const avgScore = await this.scoreService.findScoresAVGByMemberId(memberId);

    const newTeam = this.teamRepository.create({
      group: 0,
      avgScore: avgScore ?? 10,
    });

    newTeam.events = Promise.resolve(findEvent);
    newTeam.member = findMember;

    return await this.teamRepository.save(newTeam);
  }
}
