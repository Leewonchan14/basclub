"use client";

import DaumPost from "@/app/events/create/DaumPost";
import DisplayMap from "@/app/events/create/DisplayMap";
import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { NextPage } from "next";

interface Props {}

export const InputPlace: NextPage<Props> = ({}) => {
  const { address, detailAddress, point, onChangeDetailAddress } =
    useEventCreateContext();
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
      <div className="flex items-center gap-2 mb-4 text-nowrap">
        상세주소 :
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg max-w-lg outline-none"
          maxLength={30}
          value={detailAddress}
          onChange={(e) => onChangeDetailAddress(e.target.value)}
        />
      </div>
      <DisplayMap
        address={address}
        detailAddress={detailAddress}
        point={point}
      />
    </div>
  );
};
