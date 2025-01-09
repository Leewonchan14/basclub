"use client";
import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { Droppable } from "@hello-pangea/dnd";
import { DraggableMember } from "./DraggableMember";

export const DroppableNotJoinTeam: React.FC<{}> = () => {
  const { notGroupedTeam: teams } = useEditTeamContext();
  return (
    <Droppable direction="horizontal" droppableId={"0"}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-24 p-4 bg-gray-50 rounded-lg border ${
            snapshot.isDraggingOver ? "bg-green-100" : "bg-blue-100"
          }`}
        >
          <h2 className="mb-2 text-lg font-bold">투입되지 않은 인원</h2>
          <div className="flex flex-wrap gap-2">
            {teams.map((t, index) => (
              <DraggableMember
                key={t.member.id}
                member={t.member}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
