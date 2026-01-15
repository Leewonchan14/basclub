import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { Service } from "@/share/lib/typeorm/DIContainer";

/**
 * Gemini AI 서비스 (LangChain 버전)
 * API 키만 설정하면 즉시 사용 가능
 *
 * 사용법:
 * 1. .env.local에 GEMINI_API_KEY 설정
 * 2. import { GeminiService } from '@/share/lib/gemini';
 * 3. await GeminiService.getInstance().generateBasketballRoast(nickname, position, height, style);
 */

@Service
export class GeminiService {
  private static instance: GeminiService;
  private model: ChatGoogleGenerativeAI | null = null;

  constructor() {
    // API 키가 있을 때만 모델 초기화
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.model = new ChatGoogleGenerativeAI({
        apiKey: apiKey,
        model: "gemini-1.5-flash",
        temperature: 0.7,
      });
      console.log("✅ Gemini API (LangChain)가 초기화되었습니다.");
    } else {
      console.warn(
        "⚠️ GEMINI_API_KEY가 설정되지 않았습니다. Mock 모드로 동작합니다.",
      );
    }
  }

  /**
   * 싱글톤 패턴으로 인스턴스 반환
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * API 키가 설정되어 있는지 확인
   */
  public isConfigured(): boolean {
    return this.model !== null;
  }

  /**
   * 농구 조롱 문구 생성
   */
  public async generateBasketballRoast(
    nickname: string,
    basketballPosition?: string,
    height?: string,
    style?: string,
  ): Promise<string> {
    // API 키가 없는 경우 Mock 응답 반환
    if (!this.model) {
      return this.getMockRoast(nickname, basketballPosition, height, style);
    }

    try {
      const prompt = this.createRoastPrompt(
        nickname,
        basketballPosition,
        height,
        style,
      );

      const messages = [new HumanMessage(prompt)];
      const result = await this.model!.invoke(messages);
      const text =
        typeof result.content === "string"
          ? result.content
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result.content.map((c) => (c as any).text || "").join("");

      return text.trim();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return this.getMockRoast(nickname, basketballPosition, height, style);
    }
  }

  /**
   * 농구 선수 프로필 설명 생성
   */
  public async generatePlayerProfile(
    nickname: string,
    basketballPosition?: string,
    height?: string,
    style?: string,
  ): Promise<string> {
    if (!this.model) {
      return this.getMockProfile(nickname, basketballPosition, height, style);
    }

    try {
      const prompt = this.createProfilePrompt(
        nickname,
        basketballPosition,
        height,
        style,
      );

      const messages = [new HumanMessage(prompt)];
      const result = await this.model.invoke(messages);
      const text =
        typeof result.content === "string"
          ? result.content
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result.content.map((c) => (c as any).text || "").join("");

      return text.trim();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return this.getMockProfile(nickname, basketballPosition, height, style);
    }
  }

  /**
   * 조롱 프롬프트 생성
   */
  private createRoastPrompt(
    nickname: string,
    position?: string,
    height?: string,
    style?: string,
  ): string {
    return `
당신은 농구 전문가이자 유머 조롱 master입니다. 
농구 선수들의 실력, 포지션, 플레이 스타일을 재미있게 조롱하는 농담을 만들어야 합니다.

규칙:
1. 반드시 농구 관련 전문 용어를 사용하세요 (드리블, 슈팅, 리바운드, 블록, 스틸, 어시스트 등)
2. 포지션별 특징을 조롱하세요 (가드, 포워드, 센터)
3. 플레이 스타일에 맞는 재치 있는 조롱을 하세요
4. 너무 심하지 않게, 그러나 재미있게 만들어야 합니다
5. 2-3 문장 이내로 간결하게 작성하세요
6. 이모지는 1-2개만 사용하세요
7. 닉네임은 반드시 포함하세요

농구 선수 정보:
닉네임: ${nickname}
포지션: ${position || "미정"}
키: ${height || "미정"}cm
스타일: ${style || "미정"}

이 선수를 재미있게 조롱하는 농담을 만들어주세요!
`;
  }

  /**
   * 프로필 프롬프트 생성
   */
  private createProfilePrompt(
    nickname: string,
    position?: string,
    height?: string,
    style?: string,
  ): string {
    return `
당신은 농구 해설가입니다. 선수의 정보를 바탕으로 전문적이고 흥미로운 프로필 설명을 작성합니다.

규칙:
1. 농구 전문 용어를 적절히 사용하세요
2. 선수의 강점과 특징을 강조하세요
3. 3-4 문장으로 간결하게 작성하세요
4. 흥미로운 사실이나 특기를 포함하세요

선수 정보:
닉네임: ${nickname}
포지션: ${position || "미정"}
키: ${height || "미정"}cm
스타일: ${style || "미정"}

이 선수에 대한 프로필 설명을 작성해주세요!
`;
  }

  /**
   * Mock 조롱 응답 (API 키가 없을 때 사용)
   */
  private getMockRoast(
    nickname: string,
    position?: string,
    height?: string,
    style?: string,
  ): string {
    const roasts = [
      `${nickname}? 그 이름을一听就知道 못하겠는데... 드리블은 어때요? 🏀`,
      `${nickname}님, ${position || "코트"}에서 뭐하는지 알아요? 그저 서 있는 거요!`,
      `키가 ${height || "알 수 없"}cm라고? 그래도 리바운드 하나는 제대로 못 해요!`,
      `${style || "농구"}스타일이라니... 그게 웃긴다고요, ${nickname}! 🏀`,
      `${nickname}의 슈팅은 항상 "벗어났습니다!" 외쳐야 해서 성嗓이 났어요!`,
      `가드(${position?.includes("가드") ? "O" : "X"}), 포워드(${position?.includes("포워드") ? "O" : "X"}), 센터(${position?.includes("센터") ? "O" : "X"})... 어디에도 안 어울리는 ${nickname}!`,
      `${nickname}의 바스켓볼 스킬은... 솔직히 말하면, 그것보다 ${nickname}이(가) 하는 다른 일이 더 재밌어요! 🏀`,
      `"${nickname}"라는 이름이 과대평가된 것 같아요. 실제 실력은 ${style || "평범"} 수준이고요!`,
    ];

    return roasts[Math.floor(Math.random() * roasts.length)];
  }

  /**
   * Mock 프로필 응답
   */
  private getMockProfile(
    nickname: string,
    position?: string,
    height?: string,
    style?: string,
  ): string {
    return `
[${nickname}의 농구 프로필]

🏀 선수 정보:
${position ? `• 포지션: ${position}` : ""}
${height ? `• 키: ${height}cm` : ""}
${style ? `• 플레이 스타일: ${style}` : ""}

${nickname}은(는) 농구 코트에서 자신만의 플레이 스타일로 팬들을 사로잡습니다!
    `.trim();
  }
}

/**
 * 사용 예시:
 *
 * import { GeminiService } from '@/share/lib/gemini';
 *
 * const service = GeminiService.getInstance();
 * const roast = await service.generateBasketballRoast(
 *   '농구왕',
 *   '가드',
 *   '180',
 *   '슈팅'
 * );
 *
 * console.log(roast);
 * // 출력: "농구왕? 그 이름을一听就知道 못하겠는데... 드리블은 어때요? 🏀"
 */
