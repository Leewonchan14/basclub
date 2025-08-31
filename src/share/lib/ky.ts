import ky from 'ky';

// 기본 ky 인스턴스 생성
export const api = ky.create({
  prefixUrl: '/api',
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'delete'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      request => {
        // 요청 전에 필요한 헤더나 인증 정보를 추가할 수 있습니다
        console.log(`Making request to: ${request.url}`);
      }
    ],
    afterResponse: [
      (request, options, response) => {
        // 응답 후 로깅이나 처리
        console.log(`Response received: ${response.status}`);
        return response;
      }
    ]
  }
});

// 이벤트 관련 API 클라이언트
export const eventsApi = api.extend({
  prefixUrl: '/api/events'
});

// 사용자 관련 API 클라이언트
export const usersApi = api.extend({
  prefixUrl: '/api/user'
});

// 점수 관련 API 클라이언트
export const scoresApi = api.extend({
  prefixUrl: '/api/score'
});

// 인증 관련 API 클라이언트
export const authApi = api.extend({
  prefixUrl: '/api/auth'
});
