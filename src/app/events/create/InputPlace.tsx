"use client";

import DaumPost from "@/app/events/create/DaumPost";
import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { NextPage } from "next";
import Link from "next/link";

export const InputPlace: NextPage = () => {
  const { events, isLoading } = useFetchSelectedEvents();
  const { inputEvent, handleChangeDetailAddress } = useEventCreateContext();

  const {
    address,
    detailAddress,
    coordinates: point,
  } = events ? events : inputEvent;

  const addressParam =
    new URLSearchParams({ address: detailAddress }).toString().split("=")[1] ||
    "상세 주소";

  const findLoadUrl = `https://map.kakao.com/link/to/${addressParam},${point.lat},${point.lng}`;

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
            <DaumPost
              buttonText="주소검색"
              className="text-nowrap font-bold text-orange-600 hover:underline"
            />
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
            <Link
              className="inline text-nowrap font-bold text-orange-600"
              href={findLoadUrl}
              target="_blank"
            >
              길찾기
            </Link>
          )}
        </>
      )}
    </div>
  );
};
