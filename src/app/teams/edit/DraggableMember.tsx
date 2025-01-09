"use client";
import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { Member } from "@/entity/member.entity";
import { Properties } from "@/entity/transformer/pain-object";
import { Draggable } from "@hello-pangea/dnd";

export const DraggableMember: React.FC<{
  member: Properties<Member>;
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
          className="border-2 border-blue-100 rounded-lg shadow"
        >
          <MemberProfile
            member={member}
            isLoading={false}
            avgScore={scoreMap[member.id]}
            className={`bg-blue-500 rounded-lg cursor-pointer ${
              snapshot.isDragging && "!text-white bg-gray-300"
            }`}
          />
        </div>
      )}
    </Draggable>
  );
};
