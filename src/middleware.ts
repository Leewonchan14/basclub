// middleware.ts
import { JWTHandler, jwtHandler } from "@/feature/auth/jwt-handler";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get(JWTHandler.STORE_KEY)?.value;
  const payload = await jwtHandler.verifyToken(token);
  const isAuthenticated = !!payload;

  // /login 경로는 로그인 상태라면 /events 로 리다이렉트
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  // 인증 상태라면 토큰 업데이트
  if (isAuthenticated) {
    request.cookies.set({
      ...JWTHandler.COOKIE_OPTION,
      name: JWTHandler.STORE_KEY,
      value: await jwtHandler.createToken(payload),
    });

    return response;
  }

  return response;
}

// 경로를 제외한 모든 경로
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
