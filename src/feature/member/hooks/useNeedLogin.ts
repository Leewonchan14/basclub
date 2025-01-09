import { PlainMember } from "@/entity/member.entity";
import { useRouter } from "next/navigation";
import { useFetchOwn } from "./useFetchOwn";

export const useNeedLogin = () => {
  const { own, isLoading } = useFetchOwn();
  const isLogin = !isLoading && !!own;
  const router = useRouter();
  const needLoginPromise = () =>
    new Promise<PlainMember>((resolve) => {
      if (isLoading) return;
      if (isLogin) return resolve(own);
      router.push("/login");
    });

  return { own, isLoading, needLoginPromise };
};
