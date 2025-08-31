"use client";

import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Avatar } from "flowbite-react";

export const Profile: React.FC<{}> = () => {
  const { own, isLoading } = useFetchOwn();

  if (isLoading || !own)
    return (
      <Avatar className="animate-pulse" rounded>
        <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200"></div>
      </Avatar>
    );

  return (
    <Avatar rounded img={own.profileUrl}>
      <div className="font-bold text-gray-800">{own.nickname}</div>
    </Avatar>
  );
};

export default Profile;
