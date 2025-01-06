import { Team } from "@/entity/team.entity";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Repository } from "typeorm";

@Service
export class TeamService implements IService<Team> {
  @InjectRepository(Team)
  private teamRepository: Repository<Team>;

  async getRepository() {
    return this.teamRepository;
  }
}
