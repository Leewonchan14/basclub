"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { Button } from "@/app/share/ui/button";
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
      <Button
        disabled={isPending}
        className="min-w-40"
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
      </Button>
    </div>
  );
};
