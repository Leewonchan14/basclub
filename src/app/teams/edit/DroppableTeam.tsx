"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { SmallDeleteButton } from "@/app/ui/share/SmallDeleteButton";
import { PlainTeam } from "@/entity/team.entity";
import { Droppable } from "@hello-pangea/dnd";
import { DraggableMember } from "./DraggableMember";

export const DroppableTeam: React.FC<{ teams: PlainTeam[]; group: number }> = ({
  teams,
  group,
}) => {
  const { setTeams, teams: teamGroups } = useEditTeamContext();
  const teamCharacter = String.fromCharCode(64 + group);

  const removeTeam = (group: number) => {
    setTeams((teams) => {
      const sourceTeam = teams[group];
      const newTeams = teams.filter((_, i) => i !== group);

      newTeams[0] = [...newTeams[0], ...sourceTeam];
      return newTeams;
    });
  };

  return (
    <Droppable droppableId={String(group)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={"w-full"}
        >
          <div className="mb-2 flex items-center justify-between text-nowrap text-lg font-bold">
            <div>팀 {teamCharacter}</div>
            <SmallDeleteButton
              className="text-xl"
              onClick={() => removeTeam(group)}
            />
          </div>
          <ul
            className={`w-full rounded-lg ${snapshot.isDraggingOver && "bg-green-100"}`}
          >
            {teams.map((t, index) => (
              <DraggableMember
                key={t.member.id}
                isPinned={t.isPinned}
                member={t.member}
                index={index}
              />
            ))}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
};
