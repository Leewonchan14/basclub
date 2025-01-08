import { Score } from "@/entity/score.entity";
import { InjectRepository, Service } from "@/share/lib/DiContainer";
import { dataSource } from "@/share/lib/typeorm/app-data-source";
import { Repository } from "typeorm";

@Service("ScoreService")
export class ScoreService {
  @InjectRepository(Score)
  private scoreRepository: Repository<Score>;

  async findById(id: string) {
    await dataSource();
    return this.scoreRepository.findOne({ where: { id } });
  }

  async findAll() {
    await dataSource();
    return this.scoreRepository.find({});
  }
}
