import "reflect-metadata";

import { Member } from "@/entity/member.entity";
import { InjectRepository, Service } from "@/share/lib/DiContainer";
import { dataSource } from "@/share/lib/typeorm/app-data-source";
import { Repository } from "typeorm";

@Service("MemberService")
export class MemberService {
  @InjectRepository(Member)
  private memberRepository: Repository<Member>;

  async findById(id: number) {
    await dataSource();
    this.memberRepository.findOne({ where: { id } });
  }

  async findSome() {
    await dataSource();
    return this.memberRepository.find({});
  }
}
