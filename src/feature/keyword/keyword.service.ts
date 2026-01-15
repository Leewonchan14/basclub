import { Keyword } from "@/entity/keyword.entity";
import { KeywordVote } from "@/entity/keyword-vote.entity";
import { EVoteType } from "@/entity/enum/vote-type";
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

  @InjectRepository(KeywordVote)
  private voteRepository: Repository<KeywordVote>;

  async findByTargetMemberId(
    targetMemberId: string,
    page: number = 1,
    limit: number = 5,
    sortBy: "popularity" | "newest" = "popularity",
  ) {
    const allKeywords = await this.keywordRepository.find({
      where: { targetMemberId },
      relations: ["author", "targetMember", "votes", "votes.voter"],
      order: { createdAt: "ASC" },
    });

    const keywordsWithScores = allKeywords.map((k) => {
      const plain = k.toPlain();
      const likeCount = plain.votes.filter(
        (v) => v.type === EVoteType.LIKE,
      ).length;
      const dislikeCount = plain.votes.filter(
        (v) => v.type === EVoteType.DISLIKE,
      ).length;
      const netScore = likeCount - dislikeCount;
      return { ...plain, netScore, likeCount, dislikeCount };
    });

    const sortedKeywords = keywordsWithScores.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return b.netScore - a.netScore;
      }
    });

    const total = sortedKeywords.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const items = sortedKeywords.slice(offset, offset + limit);

    return {
      items,
      total,
      page,
      totalPages,
    };
  }

  async findByTeamId(teamId: string) {
    return this.keywordRepository.find({
      where: { teamId },
      relations: ["author", "targetMember", "votes", "votes.voter"],
      order: { createdAt: "ASC" },
    });
  }

  async findByAuthorId(authorId: string) {
    return this.keywordRepository.find({
      where: { authorId },
      relations: ["author", "targetMember", "votes", "votes.voter"],
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
      relations: ["author", "targetMember", "votes", "votes.voter"],
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

  async toggleVote(keywordId: string, voterId: string, type: EVoteType) {
    const keyword = await this.findById(keywordId);
    if (!keyword) throw new Error("Keyword not found");

    const existingVote = await this.voteRepository.findOne({
      where: { keywordId, voterId },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        await this.voteRepository.remove(existingVote);
      } else {
        existingVote.type = type;
        await this.voteRepository.save(existingVote);
      }
    } else {
      const newVote = this.voteRepository.create({
        keywordId,
        voterId,
        type,
      });
      await this.voteRepository.save(newVote);
    }

    return this.findById(keywordId);
  }

  async getRepository() {
    return this.keywordRepository;
  }
}
