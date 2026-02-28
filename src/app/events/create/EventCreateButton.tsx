"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { useConfirm } from "@/app/ui/share/ConfirmModal";
import { DeleteButton } from "@/app/ui/share/DeleteButton";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {}

export const EventCreateButton: React.FC<Props> = () => {
  const { selectedDate, goToDay } = useSelectedDate();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { inputEvent } = useEventCreateContext();
  const { showConfirm, ConfirmComponent } = useConfirm();
  const { mutateAsync: create, isPending: isPendingCreate } = useMutation(
    eventsMutateOption.upsert,
  );
  const { mutateAsync: remove, isPending: isPendingDelete } = useMutation(
    eventsMutateOption.remove,
  );

  const handleClick = async () => {
    setMessage("");
    if (!inputEvent?.address) {
      setMessage("주소를 입력해주세요");
      return;
    }
    await create({
      ...inputEvent,
      timeSlot: {
        start: inputEvent.timeSlot.start.toString(),
        end: inputEvent.timeSlot.end.toString(),
      },
    });
    goToDay(selectedDate);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <PrimaryButton
          disabled={isPendingCreate}
          onClick={handleClick}
          className="inline-flex w-full justify-center gap-2 rounded-lg p-2 font-bold text-white disabled:opacity-80"
        >
          저장하기
          {isPendingCreate && (
            <Spinner>
              <Spinner.Spin />
            </Spinner>
          )}
        </PrimaryButton>
        {inputEvent?.id && (
          <DeleteButton
            disabled={isPendingDelete}
            onClick={async () => {
              const isYes = await showConfirm("정말 삭제하시겠습니까?");
              if (isYes) {
                await remove(inputEvent.id);
                goToDay(selectedDate);
              }
            }}
            className="w-full justify-center"
          >
            일정 삭제
            {isPendingDelete && (
              <Spinner>
                <Spinner.Spin />
              </Spinner>
            )}
          </DeleteButton>
        )}
      </div>
      {message && (
        <div className="ml-2 w-full rounded-lg bg-white p-4 text-center font-bold text-red-600 shadow-lg">
          {message}
        </div>
      )}
      <ConfirmComponent />
    </>
  );
};
