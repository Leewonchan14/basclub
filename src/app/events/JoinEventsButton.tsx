import { memberQueryApi } from "@/feature/member/member-query";
import { useQuery } from "@tanstack/react-query";

export const JoinEventsButton = ({ eventsId }: { eventsId: string }) => {
  const { isLoading, data } = useQuery(memberQueryApi.findOwn);
  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <button className="py-2 px-10 font-bold text-white bg-orange-600 rounded-lg text-nowrap">
        참가하기
      </button>
    </div>
  );
};
