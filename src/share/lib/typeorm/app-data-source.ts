import { Events } from "@/entity/event.entity";
import { Keyword } from "@/entity/keyword.entity";
import { Member } from "@/entity/member.entity";
import { Score } from "@/entity/score.entity";
import { Team } from "@/entity/team.entity";
import { DataSource } from "typeorm";

const originDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Member, Team, Events, Score, Keyword],
  synchronize: false,
  logging: ["error"],
  migrations: [],
  ssl: { rejectUnauthorized: false },
  subscribers: [],
  // 연결 풀 설정 추가
  extra: {
    max: 1, // 서버리스는 단일 연결이 효율적
    min: 0, // 최소 연결 불필요
    acquireTimeoutMillis: 5000, // 빠른 타임아웃
    idleTimeoutMillis: 10000, // 짧은 유휴시간
    createTimeoutMillis: 5000, // 빠른 생성 타임아웃
    createRetryIntervalMillis: 100, // 빠른 재시도

    // 서버리스 DB 전용 설정
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
    query_timeout: 10000,
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
