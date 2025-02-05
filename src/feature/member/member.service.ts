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

    // 준웅씨 프로필 사진 변경하기
    if (findMember?.id === "3883039025") {
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

  async generateOriginMemberGuest(
    memberId: string, //
    guestCnt: number
  ) {
    let originMember = await this.findById(memberId);
    // 게스트라면 진짜 멤버찾기
    if (originMember?.guestBy) {
      originMember = await this.findById(originMember.guestBy);
    }
    if (!originMember) {
      throw new Error("Member not found");
    }

    const existGuests =
      (guestCnt &&
        (await this.memberRepository.find({
          where: { guestBy: originMember.id },
          order: { createdAt: "ASC" },
          take: guestCnt,
        }))) ||
      [];

    const newGuests = _.range(Math.max(0, guestCnt - existGuests.length)).map(
      (i) => {
        const newGuests = this.memberRepository.create({
          id: uuid(),
          role: ERole.GUEST,
          nickname: `${originMember.nickname}-Guest-${
            existGuests.length + i + 1
          }`,
          profileUrl: originMember.profileUrl,
        });

        newGuests.guestBy = originMember.id;

        return newGuests;
      }
    );

    await this.memberRepository.save(newGuests);

    const members = [originMember, ...existGuests, ...newGuests];
    const memberIds = members.map((m) => m.id);

    return { originMember, members, memberIds };
  }

  async getRepository() {
    return this.memberRepository;
  }
}
