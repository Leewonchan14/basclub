import { Keyword } from "@/entity/keyword.entity";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { Repository } from "typeorm";

@Service
export class KeywordService implements IService<Keyword> {
  @InjectRepository(Keyword)
  private keywordRepository: Repository<Keyword>;

  async findByTargetMemberId(targetMemberId: string) {
    return this.keywordRepository.find({
      where: { targetMemberId },
      relations: ["author", "targetMember"],
      order: { createdAt: "ASC" },
    });
  }

  async findByTeamId(teamId: string) {
    return this.keywordRepository.find({
      where: { teamId },
      relations: ["author", "targetMember"],
      order: { createdAt: "ASC" },
    });
  }

  async findByAuthorId(authorId: string) {
    return this.keywordRepository.find({
      where: { authorId },
      relations: ["author", "targetMember"],
      order: { createdAt: "ASC" },
    });
  }

  async create(data: {
    keyword: string;
    authorId: string;
    targetMemberId: string;
    teamId?: string;
  }) {
    const newKeyword = this.keywordRepository.create(data);
    const saved = await this.keywordRepository.save(newKeyword);
    return await this.findById(saved.id);
  }

  async findById(id: string) {
    return this.keywordRepository.findOne({
      where: { id },
      relations: ["author", "targetMember"],
    });
  }

  async delete(id: string) {
    const keyword = await this.findById(id);
    if (!keyword) {
      throw new Error("Keyword not found");
    }
    return this.keywordRepository.remove(keyword);
  }

  async exists(keyword: string, targetMemberId: string) {
    const trimmedKeyword = keyword.trim();
    const count = await this.keywordRepository.count({
      where: { keyword: trimmedKeyword, targetMemberId },
    });
    return count > 0;
  }

  async getRepository() {
    return this.keywordRepository;
  }
}
