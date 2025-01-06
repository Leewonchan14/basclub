import { Member } from "@/entity/member.entity";
import { InjectRepository, Service } from "@/share/lib/typeorm/DIContainer";
import { DeepPartial, Repository } from "typeorm";

@Service
export class MemberService {
  @InjectRepository(Member)
  memberRepository: Repository<Member>;

  findById(id: number) {
    return this.memberRepository.findOne({ where: { id } });
  }

  save(obj: DeepPartial<Member>) {
    return this.memberRepository.save(this.memberRepository.create(obj));
  }
}
