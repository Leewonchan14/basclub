"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Kakao: any;

const useShareKakao = () => {
  const { events } = useFetchSelectedEvents();

  const addressParam = new URLSearchParams({ k: events?.detailAddress ?? "" })
    .toString()
    .split("=")[1];

  const findLoadLink = `https://map.kakao.com/link/to/${addressParam},${events?.coordinates.lat},${events?.coordinates.lng}`;
  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
    }
  }, []);

  const onClickShare = async () => {
    if (!events) return;

    const imageUrl = `https://basclub.vercel.app/background_group.jpeg`;
    const joinLink = `${window.location.href}`;

    Kakao.Share.createDefaultButton({
      container: "#kakaotalk-sharing-btn",
      objectType: "feed",
      content: {
        title: `${day_js(events.date).format("MM월 DD일 ddd요일")} \n${day_js(
          events.timeSlot.start,
        ).format("a h시 mm분")} ~ ${day_js(events.timeSlot.end).format(
          "a h시 mm분",
        )}`,
        description: `${events.address}에서 농구해요!`,
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

  return { onClickShare, findLoadLink };
};

export default useShareKakao;
