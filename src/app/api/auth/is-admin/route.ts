import { ERole } from "@/entity/enum/role";
import { IPayLoad, jwtHandler } from "@/feature/auth/jwt-handler";
import { JWTHandler } from "@/feature/auth/jwt-handler";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ isAdmin: true });
    }
    
    const token = cookies().get(JWTHandler.STORE_KEY)?.value;
    const payload = await jwtHandler.verifyToken(token);
    const isAdmin = (payload as IPayLoad)?.role === ERole.ADMIN;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
};
