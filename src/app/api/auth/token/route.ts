import { JWTHandler } from "@/feature/auth/jwt-handler";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const token = cookies().get(JWTHandler.STORE_KEY)?.value;
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get token" },
      { status: 500 }
    );
  }
};
