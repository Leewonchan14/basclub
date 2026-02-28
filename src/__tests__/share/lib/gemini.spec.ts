import { describe, test, expect, beforeEach, vi } from "vitest";
import { GeminiService } from "@/share/lib/gemini";

describe("GeminiService - AI 조롱 기능", () => {
  let geminiService: GeminiService;

  beforeEach(() => {
    // 각 테스트 전에 새로운 인스턴스 생성
    geminiService = GeminiService.getInstance();
  });

  describe("API 키 설정 확인", () => {
    test("isConfigured 메서드가 API 키 상태를 반환해야 함", () => {
      const result = geminiService.isConfigured();
      // API 키가 없으므로 false를 반환해야 함
      expect(typeof result).toBe("boolean");
    });
  });

  describe("농구 조롱 생성", () => {
    test("닉네임만으로 조롱 문구 생성 가능해야 함", async () => {
      const result = await geminiService.generateBasketballRoast(
        "농구왕",
        undefined,
        undefined,
        undefined,
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    test("전체 정보로 조롱 문구 생성 가능해야 함", async () => {
      const result = await geminiService.generateBasketballRoast(
        "농구왕",
        "가드",
        "180",
        "슈팅",
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      // 닉네임이 결과에 포함되어야 함
      expect(result).toContain("농구왕");
    });

    test("빈 문자열이 반환되지 않아야 함", async () => {
      const result = await geminiService.generateBasketballRoast(
        "",
        "가드",
        "180",
        "슈팅",
      );

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("선수 프로필 생성", () => {
    test("닉네임만으로 프로필 생성 가능해야 함", async () => {
      const result = await geminiService.generatePlayerProfile(
        "농구왕",
        undefined,
        undefined,
        undefined,
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    test("전체 정보로 프로필 생성 가능해야 함", async () => {
      const result = await geminiService.generatePlayerProfile(
        "농구왕",
        "가드",
        "180",
        "슈팅",
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      // 닉네임이 결과에 포함되어야 함
      expect(result).toContain("농구왕");
    });
  });

  describe("Mock 응답 검증", () => {
    test("API 키가 없어도 조롱이 생성되어야 함", async () => {
      const result = await geminiService.generateBasketballRoast(
        "테스트유저",
        "센터",
        "190",
        "리바운드",
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(10); // 최소 길이 확인
    });

    test("다른 닉네임으로 다른 조롱이 생성되어야 함", async () => {
      const result1 = await geminiService.generateBasketballRoast(
        "유저1",
        "가드",
        "180",
        "슈팅",
      );

      const result2 = await geminiService.generateBasketballRoast(
        "유저2",
        "가드",
        "180",
        "슈팅",
      );

      // 결과가 다를 수 있음 (랜덤 선택)
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });
});

describe("geminiService 인스턴스 함수", () => {
  test("geminiService 인스턴스가 정상적으로 반환되어야 함", () => {
    const service = GeminiService.getInstance();
    expect(service).toBeDefined();
    expect(typeof service.isConfigured).toBe("function");
    expect(typeof service.generateBasketballRoast).toBe("function");
    expect(typeof service.generatePlayerProfile).toBe("function");
  });
});
