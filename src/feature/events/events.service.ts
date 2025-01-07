import { Events } from "@/entity/event.entity";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Dayjs } from "dayjs";
import { DeepPartial, Repository } from "typeorm";

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

  async findByDate(date: Dayjs) {
    return this.eventsRepository.findOne({ where: { date } });
  }
}
