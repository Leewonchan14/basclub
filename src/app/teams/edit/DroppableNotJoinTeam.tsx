"use client";
import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { Droppable } from "@hello-pangea/dnd";
import { DraggableMember } from "./DraggableMember";

export const DroppableNotJoinTeam: React.FC<{}> = () => {
  const { notGroupedTeam: teams } = useEditTeamContext();
  return (
    <Droppable droppableId={"0"}>
      {(provided, snapshot) => (
        <div
          className="w-full"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="mb-2 font-bold">투입되지 않은 인원</h2>
          <ul
            className={`flex flex-col rounded-lg ${snapshot.isDraggingOver && "bg-green-100"}`}
          >
            {teams.map((t, index) => (
              <DraggableMember
                key={t.member.id}
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
