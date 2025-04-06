"use client";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainMember } from "@/entity/member.entity";
import { Draggable } from "@hello-pangea/dnd";

export const DraggableMember: React.FC<{
  member: PlainMember;
  index: number;
}> = ({ member, index }) => {
  return (
    <Draggable draggableId={member.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex rounded-lg border-2 border-blue-100 bg-white p-4 shadow"
        >
          <MemberProfile
            member={member}
            className={`cursor-pointer justify-start rounded-lg bg-blue-500 transition-transform ${
              snapshot.isDragging && "scale-125 bg-gray-300 !text-white"
            } ${snapshot.isDropAnimating && "!scale-100"}`}
          />
        </div>
      )}
    </Draggable>
  );
};
