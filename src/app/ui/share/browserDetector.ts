export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent,
  );
};

export const openInDefaultBrowser = (url?: string) => {
  const targetUrl = url || window.location.href;
  const browserUrl = `intent://${window.location.host + window.location.pathname + window.location.search}#Intent;scheme=http;end`;

  // 새 탭에서 기본 브라우저로 열기 시도
  const link = document.createElement("a");
  link.href = browserUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  // fallback을 위해 일반 URL도 시도
  link.onclick = () => {
    setTimeout(() => {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }, 500);
  };

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const detectBrowser = () => {
  if (typeof window === "undefined")
    return { isInAppBrowser: false, browserName: "" };

  const userAgent = window.navigator.userAgent;

  // 각 SNS/메신저 앱의 인앱브라우저 감지
  const inAppBrowsers = {
    kakao: /KAKAOTALK/i.test(userAgent),
    instagram: /Instagram/i.test(userAgent),
    facebook: /FBAN|FBAV/i.test(userAgent),
    twitter: /TwitterAndroid|Twitter for iPhone/i.test(userAgent),
    line: /Line/i.test(userAgent),
    naver: /NAVER/i.test(userAgent),
    telegram: /Telegram/i.test(userAgent),
    whatsapp: /WhatsApp/i.test(userAgent),
    wechat: /MicroMessenger/i.test(userAgent),
    tiktok: /TikTok/i.test(userAgent),
    linkedin: /LinkedInApp/i.test(userAgent),
    snapchat: /Snapchat/i.test(userAgent),
    discord: /Discord/i.test(userAgent),
  };

  const detectedBrowser = Object.entries(inAppBrowsers).find(
    ([, isDetected]) => isDetected,
  );
  const isInAppBrowser = !!detectedBrowser;
  const browserName = detectedBrowser ? detectedBrowser[0] : "";

  return {
    isInAppBrowser,
    browserName,
    userAgent,
  };
};
