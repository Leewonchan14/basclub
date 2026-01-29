"use client";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PositionSelectModal } from "@/app/ui/member/PositionSelectModal";
import { EPosition } from "@/entity/enum/position";
import { PlainMember } from "@/entity/member.entity";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useUpdatePositions } from "@/feature/member/hooks/useUpdatePositions";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

export const DraggableMember: React.FC<{
  member: PlainMember;
  index: number;
}> = ({ member, index }) => {
  const { own, isAdmin } = useFetchOwn();
  const { mutate: updatePositions, isPending: isUpdatingPositions } =
    useUpdatePositions();
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  const canEditPositions = isAdmin || own?.id === member.id;

  const handleClick = (e: React.MouseEvent) => {
    if (canEditPositions && e.target === e.currentTarget) {
      setIsPositionModalOpen(true);
    }
  };

  const handleClosePositionModal = () => {
    setIsPositionModalOpen(false);
  };

  const handleSavePositions = (positions: EPosition[]) => {
    updatePositions({
      memberId: member.id,
      positions,
    });
  };

  return (
    <>
      <Draggable draggableId={member.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`border-primary-100 relative flex rounded-lg border-2 bg-white p-4 shadow ${canEditPositions ? "cursor-pointer" : ""}`}
            onClick={handleClick}
          >
            {isUpdatingPositions && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              </div>
            )}
            <MemberProfile
              member={member}
              className={`justify-start transition-transform ${
                snapshot.isDragging && "scale-105"
              } ${snapshot.isDropAnimating && "!scale-100"} ${isUpdatingPositions ? "opacity-50" : ""}`}
            />
          </div>
        )}
      </Draggable>
      <PositionSelectModal
        isOpen={isPositionModalOpen}
        onClose={handleClosePositionModal}
        onSave={handleSavePositions}
        currentPositions={member.positions || []}
        isLoading={isUpdatingPositions}
      />
    </>
  );
};
