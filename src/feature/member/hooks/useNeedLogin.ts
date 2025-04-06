import { PlainMember } from "@/entity/member.entity";
import { useRouter } from "next/navigation";
import { useFetchOwn } from "./useFetchOwn";

export const useNeedLogin = () => {
  const { own, isLoading } = useFetchOwn();
  const isLogin = !isLoading && !!own;
  const router = useRouter();

  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    response_type: "code",
  }).toString();

  const link = `${url}?${params}`;

  const needLoginPromise = () =>
    new Promise<PlainMember>((resolve) => {
      if (isLoading) return;
      if (isLogin) return resolve(own);

      window.localStorage.setItem("redirectUri", window.location.href);
      router.push(link);
    });

  return { own, isLoading, needLoginPromise };
};
