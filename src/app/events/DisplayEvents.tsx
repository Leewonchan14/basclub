"use client";

import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import LeafletMap from "@/app/events/leaflet-map";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { useFetchRecentEventByNow } from "@/feature/events/hooks/useFetchRecentEventByNow";
import useShareKakao from "@/feature/events/hooks/useShareKakao";
import { day_js } from "@/share/lib/dayjs";
import { Button } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoNavigateCircleSharp } from "react-icons/io5";

interface Props {}

const DisplayEvents: NextPage<Props> = ({}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isExistSelectedEvents } = useFetchEventsExist();
  const { events, isLoading } = useFetchSelectedEvents();
  const { onClickShare, findLoadLink } = useShareKakao();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return <EventSkeleton />;
  }

  if (!isExistSelectedEvents || !events) {
    return <NotExistEvents />;
  }

  const timeSlot = {
    start: day_js(events.timeSlot?.start),
    end: day_js(events.timeSlot?.end),
  };

  const startTimeStr = timeSlot.start.format("a hh:mm");
  const endTimeStr = timeSlot.end.format("a hh:mm");
  const rangeHour = timeSlot.end
    .diff(timeSlot.start, "hour")
    .toString()
    .padStart(2, "0");
  const rangeMinute = (timeSlot.end.diff(timeSlot.start, "minute") % 60)
    .toString()
    .padStart(2, "0");

  const { address, detailAddress } = events;

  return (
    <EventContainer>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between font-bold text-orange-500">
          <div>{startTimeStr}</div>
          <div className="text-lg font-bold">
            총 {rangeHour}시간 {rangeMinute}분
          </div>
          <div>{endTimeStr}</div>
        </div>
        <div className="flex w-full items-center justify-center font-semibold">
          <div className="aspect-square w-3 translate-x-1/2 rounded-full bg-orange-500" />
          <div className="h-[4px] w-3/4 rounded-full bg-orange-500" />
          <div className="aspect-square w-3 -translate-x-1/2 rounded-full bg-orange-500" />
        </div>
      </div>

      <LeafletMap center={[events.coordinates.lat, events.coordinates.lng]} />

      <Link
        href={findLoadLink}
        target="_blank"
        className="flex w-full gap-1 underline"
      >
        <span className="text-blue-600">{address + " " + detailAddress}</span>
      </Link>

      <div className="flex h-12 w-full items-center gap-1">
        <Button
          onClick={onClickShare}
          className="flex h-full w-full items-center gap-2 !p-0"
          color="alternative"
          id="kakaotalk-sharing-btn"
        >
          <KakaoShareButton />
          <span className="text-nowrap text-sm font-bold">
            카카오톡으로
            <br />
            공유하기!
          </span>
        </Button>

        <Button
          onClick={() => window.open(findLoadLink, "_blank")}
          className="flex h-full w-full items-center gap-1 !p-0"
          color="alternative"
        >
          <IoNavigateCircleSharp className="inline text-center text-3xl text-yellow-300" />
          <span className="text-sm font-bold">길찾기</span>
        </Button>
      </div>

      <DisplayParticipants />
      <JoinEventsButton />
    </EventContainer>
  );
};

export default DisplayEvents;

const EventContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-lg">
      {children}
    </div>
  );
};

const EventSkeleton: React.FC = () => {
  return (
    <EventContainer>
      <div className="flex w-full flex-col items-center justify-center gap-4 text-gray-500">
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="h-52 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </EventContainer>
  );
};

const NotExistEvents: React.FC = () => {
  const { goToDay } = useSelectedDate();
  const { recentEvent, isLoading } = useFetchRecentEventByNow();
  return (
    <EventContainer>
      <div className="flex w-full flex-col items-center justify-center gap-4 text-gray-500">
        <div>관련 일정이 없습니다.</div>
        <div
          onClick={async () => {
            if (!recentEvent) {
              return window.alert("아직 일정이 없습니다.");
            }

            goToDay(day_js(recentEvent.date));
          }}
          className={`inline-flex cursor-pointer items-center gap-2 border-b border-orange-500 font-bold text-orange-500 ${isLoading && "animate-pulse rounded-lg !border-gray-200 !bg-gray-200 !text-gray-200"}`}
        >
          가장 빠른 일정 보러가기! <FaExternalLinkAlt />
        </div>
      </div>
    </EventContainer>
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
