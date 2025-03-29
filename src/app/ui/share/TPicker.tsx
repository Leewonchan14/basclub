"use client";

import { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js } from "@/share/lib/dayjs";

export interface TPickerProps {
  tKey: keyof TimeSlot;
  text: string;
  timeSlot: TimeSlot;
  readonly?: boolean;
  setTimeSlot?: (timeSlot: TimeSlot) => void;
}

export const TPicker: React.FC<TPickerProps> = function ({
  tKey,
  text,
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

  // TODO : TimePicker 컴포넌트 추가

  return (
    <></>
    // <TimePicker
    //   label={text}
    //   readOnly={readonly}
    //   value={timeSlot[tKey]}
    //   onChange={(value) => {
    //     if (!value || !tKey) return;
    //     setTimeSlot?.({ ...timeSlot, [tKey]: value });
    //   }}
    //   ampm={false}
    //   minutesStep={10}
    //   {...{
    //     ...{},
    //   }}
    //   {...timeLimit}
    // />
  );
};
