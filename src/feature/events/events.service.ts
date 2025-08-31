import { Events } from "@/entity/event.entity";
import { day_js, getStartEndOfMonth } from "@/share/lib/dayjs";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Dayjs } from "dayjs";
import { Between, DeepPartial, MoreThanOrEqual, Repository } from "typeorm";

@Service
export class EventsService implements IService<Events> {
  @InjectRepository(Events)
  private eventsRepository: Repository<Events>;

  getRepository = async () => this.eventsRepository;

  async create(obj: DeepPartial<Events>) {
    return this.eventsRepository.create(obj);
  }

  async save(obj: DeepPartial<Events>) {
    return this.eventsRepository.save(obj);
  }

  async upsert(obj: DeepPartial<Events>) {
    return this.eventsRepository.upsert(obj, ["id"]);
  }

  async removeById(id: string) {
    return this.eventsRepository.delete(id);
  }

  async findById(id: string) {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async findByDate(date: Dayjs) {
    return this.eventsRepository.findOne({ where: { date } });
  }

  async findLasted(take: number) {
    return this.eventsRepository.find({ take, order: { date: "DESC" } });
  }

  async findRecentByNow() {
    return this.eventsRepository.find({
      where: {
        date: MoreThanOrEqual<Dayjs>(day_js(day_js().format("YYYY-MM-DD"))),
      },
      order: { date: "ASC" },
      take: 1,
    });
  }

  async findByMonth(date: Dayjs) {
    const { startOfMonth, endOfMonth } = getStartEndOfMonth(date);

    const events = await this.eventsRepository.find({
      where: {
        date: Between(startOfMonth, endOfMonth),
      },
    });

    return Object.fromEntries(
      events.map((e) => [e.date.format("YYYY-MM-DD"), e]),
    );
  }

  async toggleDone(eventId: string) {
    const event = await this.findById(eventId);
    if (!event) return;
    event.isDone = !event.isDone;
    return this.eventsRepository.save(event);
  }
  async changeLimitMem(eventId: string, limitTeamCnt: number) {
    const event = await this.findById(eventId);
    if (!event) return;
    event.limitTeamCnt = limitTeamCnt;
    return this.eventsRepository.save(event);
  }
}
