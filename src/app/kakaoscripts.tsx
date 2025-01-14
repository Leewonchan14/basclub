import Script from "next/script";
import React from "react";

export const KakaoScripts = () => {
  return (
    <React.Fragment>
      <Script
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_JAVASCRIPT_KEY}&autoload=false`}
        strategy="beforeInteractive"
      ></Script>

      {/* 카카오 공유를 위한 스크립트 */}
      <Script
        type="text/javascript"
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
        integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
        crossOrigin="anonymous"
      ></Script>

      {/* 카카오 공유를 위한 스크립트 */}
      <Script type="text/javascript" id="kakao-sdk" crossOrigin="anonymous">
        Kakao.init(&quot;{process.env.NEXT_PUBLIC_JAVASCRIPT_KEY}&quot;);
      </Script>
    </React.Fragment>
  );
};
