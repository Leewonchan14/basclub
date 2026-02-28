"use client";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainMember } from "@/entity/member.entity";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Pin } from "lucide-react";
import { cn } from "@/share/utils";
import { Draggable } from "@hello-pangea/dnd";
import { useEditTeamContext } from "./EditTeamContext";
import _ from "lodash";
import { produce } from "immer";
import { useCallback } from "react";
import { Button } from "@/app/share/ui/button";

export const DraggableMember: React.FC<{
  member: PlainMember;
  isPinned: boolean;
  index: number;
}> = ({ member, index, isPinned }) => {
  const { own, isAdmin } = useFetchOwn();
  const { setTeams } = useEditTeamContext();
  const handlePin = useCallback((memberId: string) => {
    setTeams(
      produce((teamGroups) => {
        teamGroups.forEach((teams) => {
          const findTeam = teams.find((t) => t.member.id === memberId);
          if (!findTeam) return;

          findTeam.isPinned = !findTeam.isPinned;
        });
      }),
    );
  }, []);

  const canEditPositions = isAdmin || own?.id === member.id;

  return (
    <Draggable draggableId={member.id} index={index} isDragDisabled={isPinned}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border-primary-100 relative flex rounded-lg border-2 bg-white p-4 shadow ${canEditPositions ? "cursor-pointer" : ""}`}
        >
          <PinComp isPinned={isPinned} onClick={() => handlePin(member.id)} />
          <MemberProfile
            member={member}
            className={cn(
              "justify-start transition-transform",
              snapshot.isDragging && "scale-105",
              snapshot.isDropAnimating && "!scale-100",
            )}
          />
        </div>
      )}
    </Draggable>
  );
};

const PinComp = ({
  isPinned,
  onClick,
}: {
  isPinned: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      className="absolute right-0 top-0"
      variant="ghost"
      size={"icon"}
      onClick={onClick}
    >
      <Pin fill={isPinned ? "black" : "white"} className={cn(isPinned ? "" : "opacity-30")}/>
    </Button>
  );
};
