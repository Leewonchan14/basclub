import { describe, expect, test, vi, beforeEach } from "vitest";
import { day_js } from "@/share/lib/dayjs";

interface MockEvent {
  date: ReturnType<typeof day_js>;
  address?: string;
}

interface FindOptions {
  order?: {
    date?: "ASC" | "DESC";
  };
  take?: number;
}

// 날짜 정렬 로직 테스트 (Mock 기반)
describe("EventsService - Date Sorting Logic Test", () => {
  // Mock repository
  const mockEvents: MockEvent[] = [];
  const mockRepository = {
    find: vi.fn(async (options: FindOptions) => {
      let result = [...mockEvents];

      // order 적용
      if (options.order?.date === "DESC") {
        result.sort((a, b) => {
          // Dayjs 객체를 timestamp로 비교
          const aTime = a.date.valueOf();
          const bTime = b.date.valueOf();
          return bTime - aTime; // DESC: 큰 값(최신)이 먼저
        });
      }

      // take 적용
      if (options.take) {
        result = result.slice(0, options.take);
      }

      return result;
    }),
  };

  beforeEach(() => {
    mockEvents.length = 0;
  });

  test("Dayjs 객체의 valueOf()로 정렬하면 날짜순 정렬이 됨", () => {
    const dates = [
      day_js("2025-08-23"),
      day_js("2025-12-26"),
      day_js("2025-09-20"),
      day_js("2025-10-20"),
      day_js("2025-11-20"),
    ];

    // DESC 정렬 (최신 날짜가 먼저)
    const sorted = dates.sort((a, b) => b.valueOf() - a.valueOf());

    console.log("=== Dayjs valueOf() 정렬 결과 ===");
    sorted.forEach((d, i) => {
      console.log(`[${i}] ${d.format("YYYY-MM-DD")} (valueOf: ${d.valueOf()})`);
    });

    expect(sorted[0].format("YYYY-MM-DD")).toBe("2025-12-26");
    expect(sorted[1].format("YYYY-MM-DD")).toBe("2025-11-20");
    expect(sorted[2].format("YYYY-MM-DD")).toBe("2025-10-20");
    expect(sorted[3].format("YYYY-MM-DD")).toBe("2025-09-20");
    expect(sorted[4].format("YYYY-MM-DD")).toBe("2025-08-23");
  });

  test("Mock repository에서 DESC 정렬 확인", async () => {
    // 데이터 추가 (순서 섞어서)
    mockEvents.push(
      { date: day_js("2025-08-23"), address: "Aug" },
      { date: day_js("2025-09-20"), address: "Sep" },
      { date: day_js("2025-10-20"), address: "Oct" },
      { date: day_js("2025-11-20"), address: "Nov" },
      { date: day_js("2025-12-26"), address: "Dec" },
    );

    const result = await mockRepository.find({
      take: 5,
      order: { date: "DESC" },
    });

    console.log("\n=== Mock Repository 결과 ===");
    result.forEach((e, i) => {
      console.log(`[${i}] ${e.date.format("YYYY-MM-DD")} - ${e.address}`);
    });

    expect(result[0].date.format("YYYY-MM-DD")).toBe("2025-12-26");
    expect(result[1].date.format("YYYY-MM-DD")).toBe("2025-11-20");
    expect(result[2].date.format("YYYY-MM-DD")).toBe("2025-10-20");
  });

  test("연도가 다른 경우 정렬 확인 (2024 vs 2025)", async () => {
    // 실제 버그 상황 시뮬레이션:
    // 2025년 8-9월 일정과 2024년 10-12월 일정이 섞여있는 경우
    mockEvents.push(
      { date: day_js("2025-08-23"), address: "2025-Aug" },
      { date: day_js("2025-08-30"), address: "2025-Aug" },
      { date: day_js("2025-09-06"), address: "2025-Sep" },
      { date: day_js("2025-09-13"), address: "2025-Sep" },
      { date: day_js("2025-09-20"), address: "2025-Sep" },
      { date: day_js("2024-10-20"), address: "2024-Oct" },  // 작년!
      { date: day_js("2024-11-20"), address: "2024-Nov" },  // 작년!
      { date: day_js("2024-12-26"), address: "2024-Dec" },  // 작년!
    );

    const result = await mockRepository.find({
      take: 5,
      order: { date: "DESC" },
    });

    console.log("\n=== 연도 혼합 시나리오 결과 ===");
    result.forEach((e, i) => {
      console.log(`[${i}] ${e.date.format("YYYY-MM-DD")} - ${e.address}`);
    });

    // 2025년 날짜가 2024년 날짜보다 앞에 나와야 함 (DESC)
    expect(result[0].date.format("YYYY-MM-DD")).toBe("2025-09-20");
    expect(result[1].date.format("YYYY-MM-DD")).toBe("2025-09-13");
    expect(result[2].date.format("YYYY-MM-DD")).toBe("2025-09-06");
    expect(result[3].date.format("YYYY-MM-DD")).toBe("2025-08-30");
    expect(result[4].date.format("YYYY-MM-DD")).toBe("2025-08-23");

    console.log("\n🔴 버그 원인 확인: 2024년 10-12월 일정은 take:5에서 제외됨!");
    console.log("2025년 일정이 2024년보다 최신이므로 먼저 나옴");
  });
});
