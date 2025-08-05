"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { useFetchRecentEventByNow } from "@/feature/events/hooks/useFetchRecentEventByNow";
import { day_js } from "@/share/lib/dayjs";
import React, { useCallback, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const tourSteps: Step[] = [
  {
    target: "body",
    content: (
      <div>
        <h2 className="mb-2 text-lg font-bold text-gray-800">
          Basclub에 오신 것을 환영합니다! 🏀
        </h2>
        <p className="text-gray-600">
          처음 방문하시는 것 같아 간단한 사용법을 안내해드릴게요!
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "[data-tour='date-picker']",
    content: (
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          📅 날짜 선택하기
        </h3>
        <p className="text-gray-600">
          여기를 클릭해서 원하는 날짜를 선택하세요.
          <br />
          주황색 점이 있는 날은 경기가 있는 날입니다!
        </p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: ".event-info",
    content: (
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          🏀 경기 정보 확인
        </h3>
        <p className="text-gray-600">
          경기 시간, 장소, 지도를 확인할 수 있습니다.
          <br />
          카카오톡 공유와 길찾기 기능도 제공됩니다!
        </p>
      </div>
    ),
    placement: "top",
  },
  {
    target: ".join-button",
    content: (
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          🙋‍♂️ 경기 참가하기
        </h3>
        <p className="text-gray-600">
          함께 올 게스트 수를 선택하고 &lsquo;참가하기&rsquo; 버튼을 눌러
          <br />
          경기에 참가할 수 있습니다!
        </p>
      </div>
    ),
    placement: "top",
  },
  {
    target: ".login-button",
    content: (
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">🔑 로그인하기</h3>
        <p className="text-gray-600">카카오 로그인을 해야 참가가 가능합니다!</p>
      </div>
    ),
    placement: "bottom",
  },
];

export const AppTour: React.FC<{
  showTour: boolean;
  completeTour: () => void;
}> = ({ showTour, completeTour }) => {
  const { isLoading: isFetching } = useFetchSelectedEvents();
  const { isExistSelectedEvents } = useFetchEventsExist();
  const { recentEvent, isLoading } = useFetchRecentEventByNow();
  const { goToDay } = useSelectedDate();

  // 투어가 시작될 때 현재 페이지에 일정이 없다면 가장 빠른 일정으로 이동
  useEffect(() => {
    if (showTour && !isLoading && !isExistSelectedEvents && recentEvent) {
      goToDay(day_js(recentEvent.date));
    }
  }, [showTour, isLoading, isExistSelectedEvents, recentEvent, goToDay]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;
      const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (finishedStatuses.includes(status)) {
        completeTour();
      }
    },
    [completeTour],
  );

  if (!showTour || isFetching || !isExistSelectedEvents) return null;

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous={true}
      hideCloseButton={false}
      run={showTour}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      steps={tourSteps}
      styles={{
        options: {
          primaryColor: "#ea580c", // orange-600
          backgroundColor: "#ffffff",
          textColor: "#374151",
          width: 400,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: "#ea580c",
          color: "#ffffff",
          borderRadius: 6,
          padding: "8px 16px",
          border: "none",
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: "#6b7280",
          marginRight: 8,
          padding: "8px 16px",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
        },
        buttonSkip: {
          color: "#6b7280",
          fontSize: 14,
        },
      }}
      locale={{
        back: "이전",
        close: "닫기",
        last: "완료",
        next: "다음",
        nextLabelWithProgress: "다음 ({step} / {steps})",
        skip: "건너뛰기",
      }}
    />
  );
};
