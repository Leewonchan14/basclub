"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import Spinner from "@/app/ui/share/Spinner";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { teamMutateOption } from "@/feature/team/team-mutate";
import { day_js } from "@/share/lib/dayjs";
import { useMutation } from "@tanstack/react-query";

export const MutateButton: React.FC<{ eventsId: string; date: string }> = ({
  eventsId,
  date,
}) => {
  const { goToDay } = useSelectedDate();
  const { teams } = useEditTeamContext();
  const { isPending, mutateAsync } = useMutation(
    teamMutateOption.upsert(eventsId)
  );

  return (
    <div className="flex justify-center">
      <button
        disabled={isPending}
        className="inline-flex justify-center gap-2 p-3 font-bold text-white bg-orange-600 rounded-lg min-w-40 disabled:opacity-50"
        onClick={async () => {
          await mutateAsync(teams);
          goToDay(day_js(date));
        }}
      >
        팀 저장
        {isPending && (
          <Spinner>
            <Spinner.Spin />
          </Spinner>
        )}
      </button>
    </div>
  );
};
