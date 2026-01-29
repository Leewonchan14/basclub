"use client";

import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Avatar, AvatarImage } from "@/app/share/ui/avatar";
import React from "react";

export const Profile = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { own, isLoading } = useFetchOwn();

  if (isLoading || !own)
    return (
      <div className="flex h-10 w-10 animate-pulse rounded-full bg-gray-200" />
    );

  return (
    <Avatar ref={ref} className="animate-pulse rounded">
      <AvatarImage
        src={own.profileUrl}
        alt={own.nickname}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="font-bold text-gray-800">{own.nickname}</div>
    </Avatar>
  );
});

Profile.displayName = "Profile";

export default Profile;
