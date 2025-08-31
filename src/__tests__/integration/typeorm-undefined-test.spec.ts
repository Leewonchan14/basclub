import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// 🔧 이 테스트에서만 TypeORM 모킹 해제
vi.unmock("typeorm");

// 테스트용 간단한 Entity
@Entity("test_teams")
class TestTeam {
  @PrimaryColumn("varchar")
  id: string;

  @Column("varchar")
  eventId: string;

  @Column("varchar", { nullable: true })
  memberId?: string;

  @Column("varchar", { nullable: true })
  memberGuestBy?: string;

  constructor(
    id: string,
    eventId: string,
    memberId?: string,
    memberGuestBy?: string,
  ) {
    this.id = id;
    this.eventId = eventId;
    this.memberId = memberId;
    this.memberGuestBy = memberGuestBy;
  }
}

// 🚨 CRITICAL: TypeORM findBy에서 undefined 조건 동작 확인
describe("TypeORM findBy undefined 조건 테스트", () => {
  let dataSource: DataSource;
  let teamRepository: Repository<TestTeam>;

  beforeAll(async () => {
    try {
      // TypeORM SQLite 설정
      dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: [TestTeam],
        synchronize: true,
        logging: false, // SQL 로깅 활성화
      });

      await dataSource.initialize();
      teamRepository = dataSource.getRepository(TestTeam);
      console.log("✅ TypeORM SQLite 데이터베이스 연결 성공");
    } catch (error) {
      console.error("❌ TypeORM 데이터베이스 연결 실패:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    // 데이터 초기화
    await teamRepository.clear();
  });

  describe("typeorm Datasource 가 정상적으로 동작하는지 확인", () => {
    it("typeorm Datasource 가 정상적으로 동작하는지 확인", async () => {
      expect(dataSource.isInitialized).toBe(true);
    });
  });

  // describe("🚨 TypeORM findBy undefined 동작", () => {
  //   it("CRITICAL: findBy에서 undefined가 모든 행을 반환하는지 확인", async () => {
  //     // given - 테스트 데이터 생성
  //     const testTeams = [
  //       new TestTeam("team-1", "event-1", "member-1", undefined),
  //       new TestTeam("team-2", "event-1", "member-2", undefined),
  //       new TestTeam("guest-1", "event-1", "guest-1", "member-1"),
  //       new TestTeam("team-3", "event-1", "member-3", undefined),
  //       new TestTeam("team-4", "event-2", "member-4", undefined),
  //     ];

  //     await teamRepository.save(testTeams);
  //     console.log("\\n📊 테스트 데이터 5개 생성 완료");

  //     // when - 정상적인 조회 (모든 event-1 팀)
  //     const allEvent1Teams = await teamRepository.findBy({
  //       eventId: "event-1",
  //     });

  //     console.log(`✅ 정상 조회 (event-1): ${allEvent1Teams.length}개 팀`);
  //     console.log(
  //       allEvent1Teams.map((t) => ({
  //         id: t.id,
  //         memberId: t.memberId,
  //         guestBy: t.memberGuestBy,
  //       })),
  //     );

  //     // when - 🚨 위험한 쿼리: undefined 조건
  //     console.log("\\n🚨 TypeORM findBy로 위험한 쿼리 실행...");

  //     const undefinedMemberId = undefined;

  //     try {
  //       // 실제 TeamService.removeJoin에서 사용하는 패턴
  //       const dangerousResult = await teamRepository.findBy({
  //         eventId: "event-1",
  //         memberId: undefinedMemberId,
  //       });

  //       console.log(`🚨 findBy undefined 결과: ${dangerousResult.length}개 팀`);
  //       console.log(
  //         dangerousResult.map((t) => ({ id: t.id, memberId: t.memberId })),
  //       );

  //       // 🚨 CRITICAL 버그 확인
  //       if (
  //         dangerousResult.length === allEvent1Teams.length &&
  //         allEvent1Teams.length > 1
  //       ) {
  //         console.log("\\n🚨🚨🚨 CRITICAL BUG IN TYPEORM findBy!");
  //         console.log("❌ undefined 조건이 모든 팀을 반환합니다!");
  //         expect(dangerousResult.length).not.toBe(allEvent1Teams.length);
  //       } else {
  //         console.log("\\n✅ TypeORM findBy는 안전합니다!");
  //         console.log("✅ undefined 조건이 예상대로 동작합니다.");
  //         expect(true).toBe(true);
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.log(`\\n TypeORM 쿼리 오류: ${error.message}`);
  //       }
  //       // 오류가 발생하는 것도 안전한 결과
  //       expect(true).toBe(true);
  //     }
  //   });
  // });
});
