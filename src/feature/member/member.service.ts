import { ERole } from "@/entity/enum/role";
import { Member } from "@/entity/member.entity";
import {
  InjectRepository,
  IService,
  Service,
} from "@/share/lib/typeorm/DIContainer";
import { uuid } from "@/share/lib/uuid/uuid";
import _ from "lodash";
import { Repository } from "typeorm";

@Service
export class MemberService implements IService<Member> {
  @InjectRepository(Member)
  private memberRepository: Repository<Member>;

  async findByIdOrSave(obj: {
    id: Member["id"];
    nickname: Member["nickname"];
    profileUrl: Member["profileUrl"];
  }) {
    let findMember = await this.memberRepository.findOne({
      where: { id: obj.id },
    });

    // 카톡 프로필과 다르면 프로필 다시 하게 변경
    if (findMember && findMember.profileUrl != obj.profileUrl) {
      await this.memberRepository.update(obj.id, {
        ...findMember,
        profileUrl: obj.profileUrl,
      });
    }

    if (!findMember) {
      findMember = await this.memberRepository.save(
        this.memberRepository.create(obj)
      );
    }

    return findMember;
  }

  findById(id: string) {
    return this.memberRepository.findOne({ where: { id } });
  }

  findGuestByMemberId(memberId: string) {
    return this.memberRepository.find({
      where: { guestBy: memberId },
      order: { createdAt: "ASC" },
    });
  }

  async getMemberGuestByMemberIdAndCnt(memberId: string, guestCnt: number) {
    const findMember = await this.findById(memberId);
    if (!findMember) {
      throw new Error("Member not found");
    }

    const guests = await this.memberRepository.find({
      where: { guestBy: memberId },
      order: { createdAt: "ASC" },
    });

    const newGuests = _.range(guestCnt).map((i) => {
      const newGuests = this.memberRepository.create({
        id: guests[i]?.id ?? uuid(),
        role: ERole.GUEST,
        nickname: `${findMember.nickname}-Guest-${i + 1}`,
        profileUrl: findMember.profileUrl,
      });

      newGuests.guestBy = findMember.id;

      return newGuests;
    });

    await this.memberRepository.save(newGuests);

    return { findMember, newGuests, guests };
  }

  async getRepository() {
    return this.memberRepository;
  }
}
