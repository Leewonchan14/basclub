"use client";

import { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js, Dayjs } from "@/share/lib/dayjs";
import { useEffect } from "react";

export interface TPickerProps {
  tKey: keyof TimeSlot;
  text: string;
  timeSlot: TimeSlot;
  readonly?: boolean;
  setTimeSlot?: (timeSlot: TimeSlot) => void;
}

const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return day_js().hour(hour).minute(minute);
};

const timeToString = (time: Dayjs) => {
  return time.format("HH:mm");
};

export const TPicker: React.FC<TPickerProps> = function ({
  tKey,
  // text,
  readonly,
  setTimeSlot,
  timeSlot,
}) {
  const timeLimit = {
    minTime: day_js(),
    maxTime: day_js(),
  };

  if (tKey === "start") {
    timeLimit.minTime = timeSlot.start.startOf("date");
    timeLimit.maxTime = timeSlot.end;
  } else {
    timeLimit.minTime = timeSlot.start;
    timeLimit.maxTime = timeSlot.start
      .endOf("date")
      .startOf("hour")
      .add(50, "minute");
  }

  useEffect(() => {
    console.log("timeSlot: ", timeSlot);
  }, [timeSlot]);

  // TODO : TimePicker 컴포넌트 추가

  return (
    <div className="flex w-full overflow-clip">
      <input
        readOnly={readonly}
        onChange={(e) => {
          if (!setTimeSlot) return;
          console.log("e.target.value: ", e.target.value);
          setTimeSlot({ ...timeSlot, [tKey]: parseTime(e.target.value) });
        }}
        type="time"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        // min="09:00"
        // max="18:00"
        value={timeToString(timeSlot[tKey])}
        required
      />
    </div>
  );
};

// const ClockIcon = () => {
//   return (
//     <svg
//       className="h-4 w-4 text-gray-500"
//       aria-hidden="true"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         fill-rule="evenodd"
//         d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
//         clip-rule="evenodd"
//       />
//     </svg>
//   );
// };
