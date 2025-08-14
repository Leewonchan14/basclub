import Script from "next/script";
import React from "react";

export const KakaoScripts = () => {
  return (
    <React.Fragment>
      {/* 카카오 지도를 위한 스크립트 */}
      <Script
        defer
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_JAVASCRIPT_KEY}&autoload=false`}
        strategy="beforeInteractive"
      />

      {/* 카카오 공유를 위한 스크립트 */}
      <Script
        defer
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
        integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />

      <Script id="kakao-sdk">
        {`Kakao.init("${process.env.NEXT_PUBLIC_JAVASCRIPT_KEY}");`}
      </Script>
    </React.Fragment>
  );
};
