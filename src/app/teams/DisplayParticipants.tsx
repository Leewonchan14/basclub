"use client";

import { useFetchEventsByDate } from "@/feature/events/event-query";

// 참가 인원들
export const DisplayParticipants = () => {
  const { members } = useFetchEventsByDate();

  if (members.length === 0) return <NoParticipants />;

  return (
    <div className="flex flex-col gap-2">
      {members.map((member, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="text-lg font-bold">팀 {index + 1}</div>
          <div className="flex flex-col gap-2">
            <div>{member.id}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NoParticipants = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>참가자가 아직 없습니다.</p>
    </div>
  );
};
