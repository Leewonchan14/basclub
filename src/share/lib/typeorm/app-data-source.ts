import { Events } from "@/entity/event.entity";
import { Keyword } from "@/entity/keyword.entity";
import { KeywordVote } from "@/entity/keyword-vote.entity";
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
  entities: [Member, Team, Events, Score, Keyword, KeywordVote],
  synchronize: true,
  logging: ["error"],
  migrations: [],
  ssl: { rejectUnauthorized: false },
  subscribers: [],
  extra: {
    max: 1,
    min: 0,
    acquireTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    createTimeoutMillis: 5000,
    createRetryIntervalMillis: 100,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
    query_timeout: 10000,
  },
});

export class AppDataSource {
  private static instance: DataSource | null = null;
  private static initializationPromise: Promise<DataSource> | null = null;

  public static async getInstance() {
    if (AppDataSource.instance && AppDataSource.instance.isInitialized) {
      return AppDataSource.instance;
    }

    if (!AppDataSource.initializationPromise) {
      AppDataSource.initializationPromise = (async () => {
        try {
          if (!originDataSource.isInitialized) {
            await originDataSource.initialize();
          }
          AppDataSource.instance = originDataSource;
          return originDataSource;
        } catch (error) {
          console.error("AppDataSource.getInstance() error: ", error);
          AppDataSource.initializationPromise = null;
          throw error;
        }
      })();
    }

    return AppDataSource.initializationPromise;
  }
}

export const dataSource = AppDataSource.getInstance;
export const syncDataSource: DataSource | null = originDataSource;
