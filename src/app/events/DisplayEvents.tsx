"use client";

import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import useShareKakao from "@/feature/events/hooks/useShareKakao";
import { day_js } from "@/share/lib/dayjs";
import { Button, Tooltip } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { IoNavigateCircleSharp } from "react-icons/io5";
interface Props {}

export const DisplayEvents: NextPage<Props> = ({}) => {
  const { isExistSelectedEvents } = useFetchEventsExist();
  const { events, isLoading } = useFetchSelectedEvents();
  const { onClickShare, findLoadLink } = useShareKakao();

  const renderWithSkeleton = () => {
    if (isLoading) {
      return (
        <>
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-gray-200" />
        </>
      );
    }

    if (!isExistSelectedEvents || !events) {
      return (
        <p className="flex w-full items-center justify-center text-gray-500">
          관련 일정이 없습니다.
        </p>
      );
    }

    const timeSlot = {
      start: day_js(events.timeSlot?.start),
      end: day_js(events.timeSlot?.end),
    };

    const { address, detailAddress } = events;

    return (
      <>
        <div className="flex items-center justify-center gap-1 font-semibold text-orange-500">
          <FaRegClock className="text-black" />
          {timeSlot.start.format("a h:mm")} ~ {timeSlot.end.format("a h:mm")}
          <span>
            {"("}총 {timeSlot.end.diff(timeSlot.start, "hour")}시간{" "}
            {timeSlot.end.diff(timeSlot.start, "minute") % 60}분{")"}
          </span>
        </div>
        <Tooltip content={"길찾기"} style="light">
          <Link
            href={findLoadLink}
            target="_blank"
            className="flex w-full gap-1 underline"
          >
            <span className="text-blue-600">
              {address + " " + detailAddress}
            </span>
          </Link>
        </Tooltip>
        <div className="flex h-12 w-full items-center gap-1">
          <Button
            onClick={onClickShare}
            className="flex h-full w-full items-center gap-2"
            color="alternative"
            id="kakaotalk-sharing-btn"
          >
            <KakaoShareButton />
            <span className="text-sm font-bold">
              카카오톡으로
              <br />
              공유하기!
            </span>
          </Button>
          <Button
            onClick={() => window.open(findLoadLink, "_blank")}
            className="flex h-full w-full items-center gap-1"
            color="alternative"
          >
            <IoNavigateCircleSharp className="inline text-center text-3xl text-yellow-300" />
            <span className="text-sm font-bold">길찾기</span>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {renderWithSkeleton()}

      <DisplayParticipants />
      <JoinEventsButton />
    </div>
  );
};

interface KakaoShareButtonProps {}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = () => {
  return (
    <div className="relative flex h-8 w-8 cursor-pointer flex-col overflow-clip rounded-xl">
      <Image
        fill
        alt="카카오톡 공유 버튼"
        src={
          "https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        }
        unoptimized
      />
    </div>
  );
};
