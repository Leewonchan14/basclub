"use client";

import { Badge } from "@/app/share/ui/badge";
import { Button } from "@/app/share/ui/button";
import { PlainMember } from "@/entity/member.entity";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useUpdatePosition } from "@/feature/member/hooks/useUpdatePosition";
import {
  POSITION_BADGE,
  POSITION_BADGE_COLORS,
} from "@/share/constants/position";
import React, { useState } from "react";
import Spinner from "../share/Spinner";
import { PositionSelectModal } from "./PositionSelectModal";

export const PositionBadges: React.FC<{
  member: PlainMember;
  isNav?: boolean;
}> = ({ member, isNav = false }) => {
  const { isAdmin, own } = useFetchOwn();
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const { isPositionPending, updatePositions } = useUpdatePosition(member.id);

  const isOwn =
    own?.id === member.id || own?.id === member.guestById || isAdmin;

  const isCanEdit = isOwn && !isPositionPending && !isNav;

  if (isPositionPending) {
    return (
      <Spinner>
        <Spinner.Spin className="h-4 w-4" />
      </Spinner>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <PositionSelectModal
        open={isPositionModalOpen && isOwn}
        onOpenChange={setIsPositionModalOpen}
        currentPositions={member.positions}
        onSave={updatePositions}
      />
      {member.positions.map((position) => (
        <Badge
          key={position}
          variant="outline"
          className={`flex h-5 w-5 items-center justify-center p-0 text-[10px] ${POSITION_BADGE_COLORS[position]}`}
        >
          {POSITION_BADGE[position]}
        </Badge>
      ))}

      {isCanEdit && (
        <Button
          onClick={() => setIsPositionModalOpen(true)}
          variant="outline"
          className="h-5 px-2 text-xs"
        >
          포지션 설정하기
        </Button>
      )}
    </div>
  );
};
