"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { SideLink } from "@/app/ui/sidenav/Sidenav";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useFetchScoreByMemberId } from "@/feature/score/hooks/useFetchScoreByMemberId";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

interface Props {
  isLogin: boolean;
}

export const ProfileLogin: NextPage<Props> = ({ isLogin }) => {
  useFetchOwn();
  return (
    <div className="mt-auto mb-16">
      {isLogin ? <Profile /> : <LoginButton />}
    </div>
  );
};

const Profile: React.FC<{}> = () => {
  "use client";

  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);
  const { own, isLoading } = useFetchOwn();
  const { score, isLoading: isLoadingScore } = useFetchScoreByMemberId(
    own?.id ?? ""
  );
  if (isLoading || !own) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="transition-shadow rounded-lg hover:shadow-xl">
        <MemberProfile
          member={own}
          avgScore={score}
          isLoading={isLoadingScore}
        />
      </div>
      <PrimaryButton
        disabled={isPending}
        className="self-end"
        onClick={async () => {
          await mutateAsync();
          router.replace("/");
        }}
      >
        로그아웃
      </PrimaryButton>
    </div>
  );
};

const LoginButton = () => {
  "use client";
  return <SideLink item={{ name: "로그인", path: "/login" }} />;
};
export default ProfileLogin;
