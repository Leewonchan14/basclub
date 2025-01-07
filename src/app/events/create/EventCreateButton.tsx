"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import Spinner from "@/app/ui/share/Spinner";
import { eventsMutateOption } from "@/feature/events/event-mutate";
import { day_js } from "@/share/lib/dayjs";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {}

const EventCreateButton: NextPage<Props> = ({}) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { address, point, selectedDate, timeSlot } = useEventCreateContext();

  const { mutateAsync, isPending } = useMutation(eventsMutateOption.upsert);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        disabled={isPending}
        onClick={async () => {
          setMessage("");
          if (!address) {
            setMessage("주소를 입력해주세요");
            return;
          }
          await mutateAsync({
            address,
            coordinates: point,
            date: day_js(selectedDate),
            timeSlot,
          });

          router.replace("/events");
        }}
        className="inline-flex gap-2 p-2 mx-auto font-bold text-white bg-orange-600 rounded-lg disabled:opacity-80"
      >
        저장하기
        {isPending && (
          <Spinner>
            <Spinner.Spin />
          </Spinner>
        )}
      </button>
      {message && <div className="ml-2 text-red-600">{message}</div>}
    </div>
  );
};

export default EventCreateButton;
