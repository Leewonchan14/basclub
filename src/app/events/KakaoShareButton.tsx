"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { PlainEvents } from "@/entity/event.entity";
import { day_js } from "@/share/lib/dayjs";
import Image from "next/image";
import React from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Kakao: any;

interface KakaoShareButtonProps {
  events: PlainEvents;
}

export const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
  events,
}) => {
  const { getSearchParam } = useSelectedDate();
  if (!events) return;
  const onClickShare = () => {
    const imageUrl = `${window.location.host}/background_group.jpeg`;
    const joinLink = `${window.location.host}/events?${getSearchParam()}`;

    const addressParam = new URLSearchParams({ k: events.detailAddress })
      .toString()
      .split("=")[1];

    const findLoadLink = `https://map.kakao.com/link/to/${addressParam},${events.coordinates.lat},${events.coordinates.lng}`;

    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
    }

    Kakao.Share.createDefaultButton({
      container: "#kakaotalk-sharing-btn",
      objectType: "feed",
      // address: events.address,
      // addressTitle: events.detailAddress,
      content: {
        title: `${day_js(events.date).format("MM월 DD일 ddd요일")} \n${day_js(
          events.timeSlot.start
        ).format("a h시 mm분")} ~ ${day_js(events.timeSlot.end).format(
          "a h시 mm분"
        )}`,
        description: `${events.detailAddress}에서 농구해요!`,
        imageUrl,
        link: {
          mobileWebUrl: joinLink,
          webUrl: joinLink,
        },
      },
      buttons: [
        {
          title: "참가하러 가기",
          link: {
            mobileWebUrl: joinLink,
            webUrl: joinLink,
          },
        },
        {
          title: "길 찾기",
          link: {
            mobileWebUrl: findLoadLink,
            webUrl: findLoadLink,
          },
        },
      ],
    });
  };

  return (
    <div className="relative flex flex-col w-12 cursor-pointer aspect-square">
      <Image
        fill
        alt="카카오톡 공유 버튼"
        src={
          "https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        }
        unoptimized
        id="kakaotalk-sharing-btn"
        onClick={onClickShare}
      />
    </div>
  );
};
