"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { SideLink } from "@/app/ui/sidenav/Sidenav";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { memberQueryApi } from "@/feature/member/member-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

interface Props {
  isLogin: boolean;
}

export const ProfileLogin: NextPage<Props> = ({ isLogin }) => {
  return (
    <div className="mt-auto">{isLogin ? <Profile /> : <LoginButton />}</div>
  );
};

const Profile: React.FC<{}> = () => {
  "use client";

  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);
  const { data: member, isLoading } = useQuery(memberQueryApi.findOwn);
  if (isLoading || !member) return null;

  return (
    <div className="flex flex-col gap-4">
      <MemberProfile member={member} />
      <button
        disabled={isPending}
        className="w-1/2 p-2 ml-auto font-bold text-center text-white bg-orange-500 rounded-lg"
        onClick={async () => {
          await mutateAsync();
          router.replace("/");
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

const LoginButton = () => {
  "use client";
  return <SideLink item={{ name: "로그인", path: "/login" }} />;
};
export default ProfileLogin;
