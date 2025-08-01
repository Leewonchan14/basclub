# Google AdSense 개발자 통합 가이드

## 프로젝트 개요

### 목표
- basclub Next.js 프로젝트에 Google AdSense를 기술적으로 통합
- AdSense 정책을 준수하는 안전한 구현
- 성능과 사용자 경험을 고려한 최적화된 광고 시스템 구현

## 1. Google AdSense 계정 설정 및 기술적 준비

### 1.1 AdSense 계정 생성

#### 사전 준비사항
- Google 계정
- 웹사이트가 최소 3개월 이상 운영
- HTTPS 인증서 설정 완료

#### 계정 설정 단계
1. **AdSense 계정 신청**
   - https://www.google.com/adsense/ 접속
   - Google 계정으로 로그인
   - 사이트 URL 입력

2. **사이트 인증**
   - HTML 태그 방식 또는 ads.txt 파일 업로드
   - DNS 설정을 통한 도메인 소유권 확인

### 1.2 필수 페이지 구현

#### 필수 페이지 생성
```typescript
// src/app/privacy/page.tsx - 개인정보처리방침
// src/app/terms/page.tsx - 이용약관  
// src/app/about/page.tsx - 회사 소개
// src/app/contact/page.tsx - 연락처
```

#### 기술적 요구사항
- **SSL 인증서**: HTTPS 필수
- **모바일 반응형**: 모든 디바이스 지원
- **페이지 로딩 속도**: Core Web Vitals 최적화
- **SEO 메타데이터**: 적절한 title, description 설정

#### SEO 메타데이터 설정
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Basclub - 농구 동호회 매칭 플랫폼",
  description: "농구를 사랑하는 사람들을 위한 동호회 매칭 서비스",
  robots: "index, follow",
  verification: {
    google: "your-google-verification-code"
  },
  openGraph: {
    title: "Basclub",
    description: "농구 동호회 매칭 플랫폼",
    images: [{ url: "/og-image.jpg" }],
  },
};
```

## 2. 기술적 구현

### 2.1 프로젝트 구조

```
src/
├── app/
│   ├── adsense-scripts.tsx      # AdSense 스크립트 로더
│   ├── layout.tsx               # 전역 AdSense 통합
│   └── ui/
│       └── ads/
│           ├── AdBanner.tsx     # 범용 광고 배너
│           ├── InFeedAd.tsx     # 인피드 광고
│           ├── SidebarAd.tsx    # 사이드바 광고
│           └── types.ts         # 광고 관련 타입
└── share/
    └── lib/
        ├── hooks/
        │   └── useAdSense.ts    # AdSense 훅
        └── analytics/
            ├── AnalyticsProvider.tsx
            └── adSenseTracking.ts
```

### 2.2 환경변수 설정

```bash
# .env.local
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### 2.3 AdSense 스크립트 컴포넌트

```typescript
// src/app/adsense-scripts.tsx
import Script from 'next/script';
import React from 'react';

export const AdSenseScripts = () => {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  
  if (!publisherId || process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  return (
    <React.Fragment>
      {/* Google AdSense 스크립트 */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      
      {/* 자동 광고 활성화 */}
      <Script id="adsense-init" strategy="afterInteractive">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${publisherId}",
            enable_page_level_ads: true
          });
        `}
      </Script>
    </React.Fragment>
  );
};
```

### 2.4 광고 컴포넌트 구현

#### TypeScript 타입 정의
```typescript
// src/app/ui/ads/types.ts
export interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface AdError {
  code: string;
  message: string;
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
```

#### 기본 광고 배너 컴포넌트
```typescript
// src/app/ui/ads/AdBanner.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { AdBannerProps, AdError } from './types';

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {}
}) => {
  const adRef = useRef<HTMLElement>(null);
  const [error, setError] = useState<AdError | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!publisherId || process.env.NODE_ENV !== 'production') {
      return;
    }

    try {
      // AdSense 광고 로드
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      }
    } catch (err) {
      console.error('AdSense error:', err);
      setError({
        code: 'LOAD_ERROR',
        message: 'Failed to load advertisement',
        slot
      });
    }
  }, [publisherId, slot]);

  if (!publisherId || process.env.NODE_ENV !== 'production') {
    return (
      <div className={`ad-placeholder bg-gray-200 p-4 text-center ${className}`}>
        <span className="text-gray-500">Advertisement (Dev Mode)</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`ad-error bg-red-100 p-4 text-center ${className}`}>
        <span className="text-red-500">Ad Load Error</span>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};
```

#### 전문화된 광고 컴포넌트들
```typescript
// src/app/ui/ads/InFeedAd.tsx
export const InFeedAd: React.FC<{ slot: string }> = ({ slot }) => {
  return (
    <AdBanner
      slot={slot}
      format="fluid"
      className="my-8 mx-auto max-w-4xl"
      style={{ minHeight: '250px' }}
    />
  );
};

// src/app/ui/ads/SidebarAd.tsx
export const SidebarAd: React.FC<{ slot: string }> = ({ slot }) => {
  return (
    <AdBanner
      slot={slot}
      format="rectangle"
      responsive={false}
      className="sticky top-4"
      style={{ width: '300px', height: '250px' }}
    />
  );
};
```

### 2.5 커스텀 훅

```typescript
// src/share/lib/hooks/useAdSense.ts
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useAdSense = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const [adLoadErrors, setAdLoadErrors] = useState<string[]>([]);

  // 광고 차단 감지
  const checkAdBlock = useCallback(() => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      setIsAdBlockEnabled(isBlocked);
      document.body.removeChild(testAd);
    }, 100);
  }, []);

  // 광고 성과 추적
  const trackAdPerformance = useCallback((slot: string, action: 'impression' | 'click') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', `ad_${action}`, {
        event_category: 'ads',
        event_label: slot,
        value: action === 'click' ? 1 : 0
      });
    }
  }, []);

  useEffect(() => {
    checkAdBlock();
  }, [checkAdBlock]);

  return {
    isAdBlockEnabled,
    adLoadErrors,
    checkAdBlock,
    trackAdPerformance
  };
};
```

### 2.6 레이아웃 통합

```typescript
// src/app/layout.tsx 수정
import { AdSenseScripts } from './adsense-scripts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AdSenseScripts />
        {/* 기존 컴포넌트들 */}
        <FlowbiteWrapper>
          <KakaoScripts />
          <QueryProviders>
            <NuqsAdapter>
              <NavBarLayout>{children}</NavBarLayout>
            </NuqsAdapter>
          </QueryProviders>
        </FlowbiteWrapper>
      </body>
    </html>
  );
}
```

```typescript
// src/app/ui/navbar/NavBarLayout.tsx 수정
import { AdBanner } from '@/app/ui/ads/AdBanner';

export const NavBarLayout = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      
      {/* 상단 배너 광고 */}
      <AdBanner 
        slot="1234567890" 
        format="horizontal"
        className="w-full max-w-screen-xl mx-auto my-4"
      />
      
      <div className="min-w-min-content-width mx-auto flex w-full max-w-mobile-width flex-1 p-4 py-4 sm:px-0">
        {children}
      </div>
      
      {/* 푸터 위 광고 */}
      <AdBanner 
        slot="0987654321" 
        format="horizontal"
        className="w-full max-w-screen-xl mx-auto my-4"
      />
      
      <Footer />
    </main>
  );
};
```

### 2.7 ads.txt 파일 설정

```
# public/ads.txt
google.com, pub-xxxxxxxxxx, DIRECT, f08c47fec0942fa0
```

## 3. AdSense 정책 준수 (개발자 관점)

### 3.1 코드 레벨 정책 준수

#### 금지 사항
```typescript
// ❌ 절대 하지 말 것
// 1. 광고 클릭 유도
<div onClick={() => adRef.current?.click()}>클릭하세요</div>

// 2. 광고 코드 수정
<ins className="adsbygoogle" style={{ display: 'none' }}>

// 3. 가짜 클릭 이벤트
adRef.current?.dispatchEvent(new MouseEvent('click'));
```

#### 올바른 구현
```typescript
// ✅ 올바른 구현
// 1. 광고와 컨텐츠 구분
<div className="border-t border-gray-200 pt-4 mt-8">
  <span className="text-xs text-gray-500 mb-2 block">광고</span>
  <AdBanner slot="1234567890" />
</div>

// 2. 적절한 여백
<div className="my-8">
  <AdBanner slot="1234567890" />
</div>

// 3. 로딩 상태 처리
{isLoading ? (
  <div className="ad-skeleton bg-gray-200 animate-pulse h-64" />
) : (
  <AdBanner slot="1234567890" />
)}
```

### 3.2 성능 최적화

#### Lazy Loading 구현
```typescript
// src/app/ui/ads/LazyAdBanner.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { AdBanner } from './AdBanner';

export const LazyAdBanner: React.FC<{ slot: string }> = ({ slot }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (adContainerRef.current) {
      observer.observe(adContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={adContainerRef} className="ad-lazy-container">
      {isVisible ? (
        <AdBanner slot={slot} />
      ) : (
        <div className="ad-placeholder bg-gray-100 h-64" />
      )}
    </div>
  );
};
```

## 4. 개발 및 테스트

### 4.1 개발 환경 설정

```typescript
// next.config.mjs 설정
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ADSENSE_TEST_MODE: process.env.NODE_ENV !== 'production'
  },
  // CSP 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' *.googlesyndication.com *.googletagservices.com;"
          }
        ]
      }
    ];
  }
};
```

### 4.2 에러 처리

```typescript
// src/app/ui/ads/AdErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class AdErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Ad Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="ad-error bg-gray-100 p-4 text-center">
          <span className="text-gray-500">광고를 불러올 수 없습니다</span>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 5. 구현 체크리스트

### Phase 1: 기본 설정 (1주)
- [ ] AdSense 계정 생성
- [ ] 환경변수 설정 (.env.local)
- [ ] AdSenseScripts 컴포넌트 구현
- [ ] ads.txt 파일 생성
- [ ] 필수 페이지 구현 (privacy, terms 등)

### Phase 2: 컴포넌트 개발 (1-2주)
- [ ] AdBanner 기본 컴포넌트
- [ ] TypeScript 타입 정의
- [ ] 에러 처리 및 폴백 UI
- [ ] 개발 모드 플레이스홀더
- [ ] 반응형 디자인 적용

### Phase 3: 고급 기능 (1주)
- [ ] LazyAdBanner (Intersection Observer)
- [ ] useAdSense 커스텀 훅
- [ ] AdErrorBoundary 구현
- [ ] 성능 최적화

### Phase 4: 통합 및 테스트 (1주)
- [ ] 레이아웃에 광고 배치
- [ ] 모바일/데스크톱 테스트
- [ ] Core Web Vitals 측정
- [ ] AdSense 정책 준수 검증

이 가이드를 따라 구현하면 Google AdSense를 안전하고 효율적으로 Next.js 프로젝트에 통합할 수 있습니다.
