"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";
import { useCallback, useEffect, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Kakao: any;

const useShareKakao = () => {
  const { events, teamsArr } = useFetchSelectedEvents();

  const findLoadLink = useMemo(() => {
    if (!events) return "";
    return `https://map.kakao.com/link/to/${events?.detailAddress},${events?.coordinates.lat},${events?.coordinates.lng}`;
  }, [events]);

  useEffect(() => {
    if (!events) return;

    const init = async () => {
      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
        console.log("SDK load Done");
      }
    };

    init();
  }, [events]);

  const onClickShare = useCallback(() => {
    if (!events) return;
    const imageUrl = `http://35.212.177.154:4000?teamCount=${teamsArr.length}&width=300&height=150`;
    const joinLink = `${window.location.href}`;

    Kakao.Share.sendDefault({
      // container: element,
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
  }, [events, findLoadLink, teamsArr.length]);

  return { findLoadLink, onClickShare };
};

export default useShareKakao;
