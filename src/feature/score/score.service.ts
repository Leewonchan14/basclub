import { Score } from "@/entity/score.entity";
import { Team } from "@/entity/team.entity";
import { EventsService } from "@/feature/events/events.service";
import { MemberService } from "@/feature/member/member.service";
import { day_js } from "@/share/lib/dayjs";
import {
  Inject,
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { FindManyOptions, LessThan, Repository } from "typeorm";

@Service
export class ScoreService implements IService<Score> {
  @InjectRepository(Score)
  private scoreRepository: Repository<Score>;

  @Inject(MemberService)
  private memberService: MemberService;

  @Inject(EventsService)
  private eventsService: EventsService;

  async findScoresAVGByMemberId(memberId: string) {
    const avg = (
      await this.scoreRepository
        .createQueryBuilder("score")
        .select("avg(score.score2 * 2 + score.score3 * 3) as average")
        .where("score.memberId = :memberId", { memberId })
        .getRawOne()
    ).average as number | null;

    return avg;
  }

  async findAvgScoresByEventsId(eventsId: string) {
    const data = (await this.scoreRepository
      .createQueryBuilder("score")
      .select([
        "score.memberId as memberId",
        "avg(score.score2 * 2 + score.score3 * 3) as average",
      ])
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("team.memberId")
          .from(Team, "team")
          .where("team.eventsId = :eventsId", { eventsId })
          .getQuery();
        return `score.memberId IN ${subQuery}`;
      })
      .groupBy("memberId")
      .getRawMany()) as {
      memberid: string;
      average: number;
    }[];

    const rt: { [k: string]: number } = Object.fromEntries(
      data.map((d) => Object.values(d).map(Number))
    );

    return rt;
  }

  async addScore(
    memberId: string,
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

  async findPageScoresByCursor(eventsId: string, cursor?: string) {
    // 가장 최근 score 조회
    const findOption: FindManyOptions<Score> = {
      where: {
        events: { id: eventsId },
      },
      order: { createdAt: "DESC" },
      relations: {
        member: true,
      },
      take: 5,
    };

    // cursor가 있으면 cursor 이전의 데이터만 조회
    if (cursor) {
      findOption.where = {
        ...findOption.where,
        createdAt: LessThan(day_js(cursor).toDate()),
      };
    }

    return await this.scoreRepository.find(findOption);
  }

  async deleteScore(scoreId: string) {
    return await this.scoreRepository.delete(scoreId);
  }

  async deleteScoresByEventsIdAndMemberId(eventId: string, memberId: string) {
    return await this.scoreRepository.delete({
      member: { id: memberId },
      events: { id: eventId },
    });
  }

  getRepository = async () => this.scoreRepository;
}
