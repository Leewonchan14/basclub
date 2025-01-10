"use client";
import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainMember } from "@/entity/member.entity";
import { Draggable } from "@hello-pangea/dnd";

export const DraggableMember: React.FC<{
  member: PlainMember;
  index: number;
}> = ({ member, index }) => {
  const { scoreMap } = useEditTeamContext();
  return (
    <Draggable draggableId={member.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border-2 border-blue-100 rounded-lg shadow`}
        >
          <MemberProfile
            member={member}
            isLoading={false}
            avgScore={scoreMap[member.id]}
            className={`bg-blue-500 rounded-lg cursor-pointer transition-transform ${
              snapshot.isDragging && "!text-white bg-gray-300 scale-125"
            } ${snapshot.isDropAnimating && "!scale-100"}`}
          />
        </div>
      )}
    </Draggable>
  );
};
