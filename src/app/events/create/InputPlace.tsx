"use client";

import DaumPost from "@/app/events/create/DaumPost";
import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import DisplayMap from "@/app/events/create/DisplayMap";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { Button } from "flowbite-react";
import { NextPage } from "next";
import { IoNavigateCircleSharp } from "react-icons/io5";

export const InputPlace: NextPage = () => {
  const { isLoading } = useFetchSelectedEvents();
  const { inputEvent, handleChangeDetailAddress } = useEventCreateContext();

  const { address, detailAddress, coordinates: point } = inputEvent;

  const addressParam =
    new URLSearchParams({ address: detailAddress }).toString().split("=")[1] ||
    "상세 주소";

  const findLoadLink = `https://map.kakao.com/link/to/${addressParam},${point.lat},${point.lng}`;

  return (
    <div className="mt-2 flex flex-col items-start gap-2 rounded-lg bg-white p-4 shadow-lg">
      <div className="text-xl font-bold">일정 장소</div>
      {isLoading && (
        <>
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-gray-200" />
        </>
      )}
      {!isLoading && (
        <>
          <div className="flex w-full flex-col items-start">
            {address}
            <DaumPost buttonText="주소검색" />
          </div>
          <input
            type="text"
            className="w-full max-w-lg rounded-lg border border-gray-300 p-2 outline-none"
            maxLength={30}
            placeholder="상세주소를 입력해주세요"
            value={detailAddress}
            onChange={(e) => handleChangeDetailAddress(e.target.value)}
          />
          {!!address && (
            <>
              <DisplayMap address={address} point={point} />
              <Button
                onClick={() => window.open(findLoadLink, "_blank")}
                className="flex w-full items-center gap-1 py-2"
                color="alternative"
              >
                <IoNavigateCircleSharp className="inline text-center text-3xl text-yellow-300" />
                <span className="text-sm font-bold">길찾기</span>
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};
