import { Events } from "@/entity/event.entity";
import { Member } from "@/entity/member.entity";
import { Team } from "@/entity/team.entity";
import { DataSource } from "typeorm";
import { Score } from "./../../../entity/score.entity";

const originDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Member, Team, Events, Score],
  synchronize: false,
  logging: ["error"],
  migrations: [],
  ssl: true,
  subscribers: [],
  // 연결 풀 설정 추가
  extra: {
    // 연결 풀 크기 설정
    max: 20, // 최대 연결 수
    min: 5, // 최소 연결 수
    // 연결 타임아웃 설정
    acquireTimeoutMillis: 30000,
    // 유휴 연결 타임아웃
    idleTimeoutMillis: 30000,
    // 연결 생성 타임아웃
    createTimeoutMillis: 30000,
    // 연결 재시도 설정
    createRetryIntervalMillis: 200,
  },
});

export class AppDataSource {
  private static instance: DataSource | null = null;
  public static async getInstance() {
    if (!AppDataSource.instance || !AppDataSource.instance.isInitialized) {
      try {
        await originDataSource.initialize();
      } catch (error) {
        //초기화 실패시 다시 시도 종료
        console.error("AppDataSource.getInstance() error: ", error);
        throw error;
      }
      AppDataSource.instance = originDataSource;
    }

    return AppDataSource.instance;
  }
}

export const dataSource = AppDataSource.getInstance;
export const syncDataSource: DataSource | null = originDataSource;
