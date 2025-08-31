/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERole } from "@/entity/enum/role";
import { day_js } from "@/share/lib/dayjs";
import { vi } from "vitest";

// typeorm 모킹
vi.mock("typeorm", () => ({
  getRepository: vi.fn(),
  getConnection: vi.fn(),
  createConnection: vi.fn(),
  Entity: vi.fn(),
  Column: vi.fn(),
  PrimaryGeneratedColumn: vi.fn(),
  ManyToOne: vi.fn(),
  OneToMany: vi.fn(),
  JoinColumn: vi.fn(),
  Repository: vi.fn(),
  DataSource: vi.fn(),
  UpdateDateColumn: vi.fn(),
  CreateDateColumn: vi.fn(),
  DeleteDateColumn: vi.fn(),
  PrimaryColumn: vi.fn(),
  Index: vi.fn(),
}));

// next.js 모킹
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// react-query 모킹
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
  QueryClient: vi.fn(),
  queryOptions: vi.fn(),
}));

// typeorm 모킹
vi.mock("@/share/lib/typeorm/app-data-source", () => ({
  dataSource: vi.fn(),
  syncDataSource: {
    getRepository: vi.fn(),
  },
}));

// nuqs 모킹
vi.mock("nuqs", () => ({
  useQueryState: vi.fn((key: string, options?: any) => {
    // 기본값 반환
    const defaultValue = options?.defaultValue || null;
    return [defaultValue, vi.fn()]; // [value, setValue]
  }),
  useQueryStates: vi.fn((config: any) => {
    const defaultValues: any = {};
    Object.keys(config).forEach((key) => {
      defaultValues[key] = config[key].defaultValue || null;
    });
    return [defaultValues, vi.fn()];
  }),
  parseAsString: {
    withDefault: (defaultValue: string) => ({ defaultValue }),
  },
  parseAsInteger: {
    withDefault: (defaultValue: number) => ({ defaultValue }),
  },
}));

// useNeedLogin 모킹
vi.mock("@/feature/member/hooks/useNeedLogin", () => ({
  useNeedLogin: () => ({
    isAdmin: true,
    goToKakaoLogin: vi.fn(),
    isLoading: false,
    isLogin: true,
    own: {
      id: "f92a1ddc-0026-41aa-93df-9effe303eadf",
      nickname: "이원찬-Guest-1",
      profileUrl:
        "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
      role: ERole.MEMBER,
      guestById: undefined,
    },
    needLoginPromise: () =>
      Promise.resolve({
        id: "f92a1ddc-0026-41aa-93df-9effe303eadf",
        nickname: "이원찬-Guest-1",
        profileUrl:
          "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
        role: ERole.MEMBER,
        guestById: undefined,
      }),
  }),
}));

// useFetchOwn 모킹
vi.mock("@/feature/member/hooks/useFetchOwn", () => ({
  useFetchOwn: () => {
    return {
      isLoading: false,
      isAdmin: false,
      own: {
        id: "f92a1ddc-0026-41aa-93df-9effe303eadf",
        nickname: "이원찬-Guest-1",
        profileUrl:
          "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
        role: ERole.MEMBER,
        guestById: null,
      },
    };
  },
}));

// useFetchEventsExist 모킹
vi.mock("@/feature/events/hooks/useFetchEventsExist", () => ({
  useFetchEventsExist: () => {
    return {
      isLoading: false,
      data: {
        [day_js().format("YYYY-MM-DD")]: "1",
      },
    };
  },
}));

// useFetchEvents 모킹
vi.mock("@/feature/events/hooks/useFetchEvents", () => ({
  useFetchSelectedEvents: () => {
    return {
      isLoading: false,
      data: {},
    };
  },
}));

// useJoinEvents 모킹
vi.mock("@/feature/events/hooks/useJoinEvents", () => ({
  useJoinEvents: () => {
    return {
      isLoading: false,
    };
  },
}));

// useToggleDone 모킹
vi.mock("@/feature/events/hooks/useToggleDone", () => ({
  useToggleDone: () => {
    return {
      isLoading: false,
    };
  },
}));

// useChangeLimitMem 모킹
vi.mock("@/feature/events/hooks/useChangeLimitMem", () => ({
  useChangeLimitMem: () => {
    return {
      isLoading: false,
    };
  },
}));
