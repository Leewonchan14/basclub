import { Score } from "@/entity/score.entity";
import { EventsService } from "@/feature/events/events.service";
import { MemberService } from "@/feature/member/member.service";
import {
  Inject,
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Repository } from "typeorm";

@Service
export class ScoreService implements IService<Score> {
  @InjectRepository(Score)
  private scoreRepository: Repository<Score>;

  @Inject(MemberService)
  private memberService: MemberService;

  @Inject(EventsService)
  private eventsService: EventsService;

  async findScoresAVGByMemberId(memberId: number) {
    const avg = (
      await this.scoreRepository
        .createQueryBuilder("score")
        .select("avg(score.score2 * 2 + score.score3 * 3) as average")
        .where("score.memberId = :memberId", { memberId })
        .getRawOne()
    ).average as number | null;

    return avg;
  }

  async findScoresByEventsId(eventsId: string) {
    const data = (await this.scoreRepository
      .createQueryBuilder("score")
      .select([
        "score.memberId as memberId",
        "avg(score.score2 * 2 + score.score3 * 3) as average",
      ])
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("score.memberId")
          .from(Score, "score")
          .where("score.eventsId = :eventsId", { eventsId })
          .getQuery();
        return `score.memberId IN ${subQuery}`;
      })
      .groupBy("memberId")
      .getRawMany()) as {
      memberid: number;
      average: number;
    }[];

    const rt: { [k: number]: number } = Object.fromEntries(
      data.map((d) => Object.values(d).map(Number))
    );

    return rt;
  }

  async addScore(
    memberId: number,
    eventsId: string,
    score2: number,
    score3: number
  ) {
    const findMember = await this.memberService.findById(memberId);
    const findEvents = await this.eventsService.findById(eventsId);

    const newScore = this.scoreRepository.create({
      score2,
      score3,
    });
    newScore.member = Promise.resolve(findMember!);
    newScore.events = Promise.resolve(findEvents!);

    return await this.scoreRepository.save(newScore);
  }

  getRepository = async () => this.scoreRepository;
}
