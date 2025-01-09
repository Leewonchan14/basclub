import { Member } from "@/entity/member.entity";
import { Properties } from "@/entity/transformer/pain-object";
import { useRouter } from "next/navigation";
import { useFetchOwn } from "./useFetchOwn";

export const useNeedLogin = () => {
  const { own, isLoading } = useFetchOwn();
  const isLogin = !isLoading && !!own;
  const router = useRouter();
  const needLoginPromise = () =>
    new Promise<Properties<Member>>((resolve) => {
      if (isLoading) return;
      if (isLogin) return resolve(own);
      console.log("로그인이 필요합니다.");
      router.replace("/login");
    });

  return { own, isLoading, needLoginPromise };
};
