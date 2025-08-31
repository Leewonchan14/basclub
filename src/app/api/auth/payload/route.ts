import { ERole } from "@/entity/enum/role";
import { IPayLoad, jwtHandler } from "@/feature/auth/jwt-handler";
import { JWTHandler } from "@/feature/auth/jwt-handler";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        id: "3862171832",
        nickname: "이원찬",
        profileUrl:
          "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
        role: ERole.ADMIN,
        guestById: null,
      } as IPayLoad);
    }
    
    const token = cookies().get(JWTHandler.STORE_KEY)?.value;
    const payload = await jwtHandler.verifyToken(token);
    
    return NextResponse.json(payload as IPayLoad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get payload" },
      { status: 500 }
    );
  }
};
