"use client";

import DaumPost from "@/app/events/create/DaumPost";
import DisplayMap from "@/app/events/create/DisplayMap";
import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { NextPage } from "next";

interface Props {}

const InputPlace: NextPage<Props> = ({}) => {
  const { address, point } = useEventCreateContext();
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-2xl font-bold">일정 장소</div>
      <div className="flex items-center gap-2">
        주소 : {address}
        <DaumPost
          buttonText="주소검색"
          className="p-2 font-bold text-orange-600 text-nowrap"
        />
      </div>
      <DisplayMap address={address} point={point} />
    </div>
  );
};

export default InputPlace;
