"use client";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import _ from "lodash";
import { useEffect, useState } from "react";

export type Score = {
  id: number; // DB 내 score 테이블의 PK라고 가정
  memberId: number;
  eventsId: number;
  score2: number;
  score3: number;
};

export const ScoreList = () => {
  const { events, members } = useFetchSelectedEvents();
  const [scoreList, setScoreList] = useState<Score[]>(
    _.range(10).map((i) => ({
      eventsId: i,
      memberId: i,
      score2: i,
      score3: i,
      id: i,
    }))
  );

  // 이벤트(농구모임) ID가 존재할 때만 득점 데이터 불러오기
  useEffect(() => {
    if (!events?.id) return;

    // 예시: GET /api/scores?eventsId=xxx
    // 실제 API, 쿼리 파라미터 등에 맞게 수정해 주세요.
    fetch(`/api/scores?eventsId=${events.id}`)
      .then((res) => res.json())
      .then((data) => {
        setScoreList(data);
      })
      .catch((err) => {
        console.error("득점 기록 불러오기 실패:", err);
      });
  }, [events]);

  if (!events || !members) {
    return null;
  }

  if (scoreList.length === 0) {
    return <div>아직 다른 멤버의 득점 기록이 없습니다.</div>;
  }

  // 멤버 이름을 구하는 유틸 함수
  const getMemberName = (memberId: number) => {
    const found = members.find((m) => m.id === memberId);
    return found ? found.nickname : `MemberID(${memberId})`;
  };

  return (
    <div className="flex flex-col gap-2">
      {scoreList.map((score) => (
        <div
          key={score.id}
          className="flex items-center justify-between p-2 rounded bg-gray-50"
        >
          <div className="font-semibold">{getMemberName(score.memberId)}</div>
          <div className="flex gap-4">
            <div>2점: {score.score2}</div>
            <div>3점: {score.score3}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
