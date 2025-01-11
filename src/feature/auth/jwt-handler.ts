import { ERole } from "@/entity/enum/role";
import { day_js } from "@/share/lib/dayjs";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const JWT_SECRET = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(JWT_SECRET);

export interface IPayLoad extends JWTPayload {
  id: string;
  role: ERole;
}

export class JWTHandler {
  static STORE_KEY = "token";
  // 2 weeks
  static TOKEN_EXPIRE_PERIOD = 1000 * 60 * 60 * 24 * 7 * 2;

  static COOKIE_OPTION: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: true,
    expires: day_js()
      .add(JWTHandler.TOKEN_EXPIRE_PERIOD, "millisecond")
      .toDate(),
  };

  createToken(payload: IPayLoad) {
    const newDate = Date.now() + JWTHandler.TOKEN_EXPIRE_PERIOD;
    return new SignJWT(payload)
      .setExpirationTime(newDate)
      .setProtectedHeader({ alg: "HS256" })
      .sign(key);
  }

  async verifyToken(token?: string | null) {
    try {
      const decoded = await jwtVerify(token!, key);
      return decoded.payload as IPayLoad;
    } catch (_error) {
      return null;
    }
  }
}

export const jwtHandler = new JWTHandler();
