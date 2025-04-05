"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { DeleteButton } from "@/app/ui/share/DeleteButton";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { eventsMutateOption } from "@/feature/events/event-mutate";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useState } from "react";

interface Props {}

export const EventMutateButton: NextPage<Props> = ({}) => {
  const { selectedDate, goToDay } = useSelectedDate();
  const [message, setMessage] = useState("");
  const { inputEvent } = useEventCreateContext();
  const { address } = inputEvent;

  const { mutateAsync: create, isPending: isPendingCreate } = useMutation(
    eventsMutateOption.upsert,
  );
  const { mutateAsync: remove, isPending: isPendingDelete } = useMutation(
    eventsMutateOption.remove,
  );

  return (
    <div className="flex items-center justify-center gap-4">
      <PrimaryButton
        disabled={isPendingCreate}
        onClick={async () => {
          setMessage("");
          if (!address) {
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
        }}
        className="inline-flex w-full justify-center gap-2 rounded-lg p-2 font-bold text-white disabled:opacity-80"
      >
        저장하기
        {isPendingCreate && (
          <Spinner>
            <Spinner.Spin />
          </Spinner>
        )}
      </PrimaryButton>
      {inputEvent.id && (
        <DeleteButton
          disabled={isPendingDelete}
          onClick={async () => {
            const isYes = window.confirm("정말 삭제하시겠습니까?");
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
      {message && <div className="ml-2 text-red-600">{message}</div>}
    </div>
  );
};
