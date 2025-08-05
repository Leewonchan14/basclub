"use client";

import { useEffect, useState } from "react";
import {
  detectBrowser,
  isMobileDevice,
  openInDefaultBrowser,
} from "./browserDetector";

interface BrowserRedirectProps {
  showDelay?: number; // 모달을 보여주기까지의 지연 시간 (ms)
}

export const BrowserRedirect: React.FC<BrowserRedirectProps> = ({
  showDelay = 300,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<{
    isInAppBrowser: boolean;
    browserName: string;
    userAgent?: string;
  }>({ isInAppBrowser: false, browserName: "", userAgent: "" });

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);

    // 모바일 기기이면서 인앱브라우저인 경우에만 모달 표시
    if (isMobileDevice() && info.isInAppBrowser) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [showDelay]);

  const handleOpenInBrowser = () => {
    openInDefaultBrowser();
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    // 24시간 동안 다시 보지 않기
    localStorage.setItem("browserRedirectDismissed", Date.now().toString());
  };

  // 이미 24시간 내에 닫았다면 표시하지 않음
  useEffect(() => {
    const dismissed = localStorage.getItem("browserRedirectDismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (dismissedTime > oneDayAgo) {
        setShowModal(false);
        return;
      }
    }
  }, []);

  if (!showModal || !browserInfo.isInAppBrowser) {
    return null;
  }

  const getBrowserDisplayName = (browserName: string) => {
    const names: Record<string, string> = {
      kakao: "카카오톡",
      instagram: "인스타그램",
      facebook: "페이스북",
      twitter: "트위터",
      line: "라인",
      naver: "네이버",
      telegram: "텔레그램",
      whatsapp: "왓츠앱",
      wechat: "위챗",
      tiktok: "틱톡",
      linkedin: "링크드인",
      snapchat: "스냅챗",
      discord: "디스코드",
    };
    return names[browserName] || browserName;
  };

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={handleClose}
      >
        {/* 모달 */}
        <div
          className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 아이콘 */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <svg
                className="h-8 w-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* 제목 */}
          <h3 className="mb-2 text-center text-lg font-bold text-gray-900">
            더 나은 경험을 위해 브라우저에서 열어보세요!
          </h3>

          {/* 설명 */}
          <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
            {getBrowserDisplayName(browserInfo.browserName)} 앱에서는 로그인이
            지속되지 않을 수 있습니다.
            <br />
            기본 브라우저에서 열면 더 안정적으로 이용하실 수 있습니다.
          </p>

          {/* 버튼들 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleOpenInBrowser}
              className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
            >
              브라우저에서 열기
            </button>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              계속 사용하기
            </button>
          </div>

          {/* 하단 안내 */}
          <p className="mt-4 text-center text-xs text-gray-500">
            24시간 동안 다시 보지 않습니다
          </p>
        </div>
      </div>
    </>
  );
};
