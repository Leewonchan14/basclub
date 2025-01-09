"use client";

import { PlainTeam } from "@/entity/team.entity";
import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { Droppable } from "@hello-pangea/dnd";
import { DraggableMember } from "./DraggableMember";

export const DroppableTeam: React.FC<{ teams: PlainTeam[]; group: number }> = ({
  teams,
  group,
}) => {
  const { setTeams } = useEditTeamContext();

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
          className={`p-4 border-2 rounded-lg w-64 ${
            snapshot.isDraggingOver ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <h2 className="flex items-center mb-2 text-lg font-bold text-nowrap">
            팀 {group}
            <button
              className="inline-block w-4 h-4 ml-auto text-xs text-white bg-red-600 rounded-full"
              onClick={() => removeTeam(group)}
            >
              x
            </button>
          </h2>
          <ul>
            {teams.map((t, index) => (
              <DraggableMember
                key={t.member.id}
                member={t.member}
                index={index}
              />
            ))}
          </ul>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
