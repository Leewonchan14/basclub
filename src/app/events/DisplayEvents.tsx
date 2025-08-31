"use client";

import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import DisplayMap from "@/app/events/create/DisplayMap";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { useAlert } from "@/app/ui/share/AlertModal";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { useFetchRecentEventByNow } from "@/feature/events/hooks/useFetchRecentEventByNow";
import useShareKakao from "@/feature/events/hooks/useShareKakao";
import { day_js } from "@/share/lib/dayjs";
import { Button, Card } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoNavigateCircleSharp } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";

interface Props {}

const DisplayEvents: NextPage<Props> = ({}) => {
  const { isExistSelectedEvents } = useFetchEventsExist();
  const { events, isLoading } = useFetchSelectedEvents();
  const { findLoadLink } = useShareKakao();
  const { showAlert, AlertComponent } = useAlert();
  const [isCopied, setIsCopied] = useState(false);

  const copyAddressToClipboard = useCallback(
    async (fullAddress: string) => {
      try {
        await navigator.clipboard.writeText(fullAddress);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2초 후 상태 리셋
      } catch (err) {
        console.error("주소 복사 실패:", err);
        await showAlert("주소 복사에 실패했습니다.");
      }
    },
    [showAlert],
  );

  if (isLoading) {
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
    <>
      <Card theme={{ root: { children: "p-4" } }} className="event-info">
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

        <DisplayMap address={events.address} point={events.coordinates} />

        <div className="flex w-full items-center gap-2">
          <Link
            href={"findLoadLink"}
            target="_blank"
            className="flex flex-1 gap-1 underline"
          >
            <span className="text-blue-600">
              {address + " " + detailAddress}
            </span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              copyAddressToClipboard(address + " " + detailAddress);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
              isCopied
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={isCopied ? "복사 완료!" : "주소 복사"}
          >
            <MdContentCopy className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-12 w-full items-center gap-1">
          <KakaoShareButton />

          <Button
            onClick={() => window.open(findLoadLink, "_blank")}
            className="flex h-full w-full items-center gap-1 !p-0"
            color="alternative"
          >
            <IoNavigateCircleSharp className="inline text-center text-3xl text-yellow-300" />
            <span className="text-sm font-bold">길찾기</span>
          </Button>
        </div>
      </Card>
      <Card theme={{ root: { children: "p-4" } }}>
        <DisplayParticipants />
        <JoinEventsButton />
      </Card>

      <AlertComponent />
    </>
  );
};

export default DisplayEvents;

const EventSkeleton: React.FC = () => {
  return (
    <Card theme={{ root: { children: "p-4" } }}>
      <div className="w-full">
        <div className="mb-4 h-12 w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="h-52 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </Card>
  );
};

const NotExistEvents: React.FC = () => {
  const { goToDay } = useSelectedDate();
  const { recentEvent, isLoading } = useFetchRecentEventByNow();
  const { showAlert, AlertComponent } = useAlert();

  return (
    <>
      <Card theme={{ root: { children: "p-4" } }}>
        <div className="flex w-full flex-col items-center justify-center gap-4 text-gray-500">
          <div>관련 일정이 없습니다.</div>
          <div
            onClick={async () => {
              if (!recentEvent) {
                await showAlert("아직 일정이 없습니다.");
                return;
              }

              goToDay(day_js(recentEvent.date));
            }}
            className={`inline-flex cursor-pointer items-center gap-2 border-b border-orange-500 font-bold text-orange-500 ${isLoading && "animate-pulse rounded-lg !border-gray-200 !bg-gray-200 !text-gray-200"}`}
          >
            가장 빠른 일정 보러가기! <FaExternalLinkAlt />
          </div>
        </div>
      </Card>
      <AlertComponent />
    </>
  );
};

interface KakaoShareButtonProps {}

export const KakaoShareButton: React.FC<KakaoShareButtonProps> = () => {
  const { onClickShare } = useShareKakao();
  return (
    <Button
      onClick={onClickShare}
      className="flex h-full w-full items-center gap-2 !p-0"
      color="alternative"
    >
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
      <span className="text-nowrap text-sm font-bold">
        카카오톡으로
        <br />
        공유하기!
      </span>
    </Button>
  );
};
