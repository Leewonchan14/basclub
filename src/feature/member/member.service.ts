import { Member } from "@/entity/member.entity";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { DeepPartial, Repository } from "typeorm";

@Service
export class MemberService implements IService<Member> {
  @InjectRepository(Member)
  private memberRepository: Repository<Member>;

  findById(id: number) {
    return this.memberRepository.findOne({ where: { id } });
  }

  save(obj: DeepPartial<Member>) {
    return this.memberRepository.save(this.memberRepository.create(obj));
  }

  async getRepository() {
    return this.memberRepository;
  }
}
