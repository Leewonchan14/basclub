"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js } from "@/share/lib/dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

export interface TPickerProps {
  tKey: keyof TimeSlot;
  text: string;
  readonly?: boolean;
}

export const TPicker: React.FC<TPickerProps> = function ({
  tKey,
  text,
  readonly,
}) {
  const { inputEvent, setTimeSlot } = useEventCreateContext();
  const timeSlot = inputEvent.timeSlot;

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

  return (
    <div className="flex w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <MobileTimePicker
          minTime={timeLimit.minTime}
          maxTime={timeLimit.maxTime}
          disabled={readonly}
          readOnly={readonly}
          label={text}
          views={["hours", "minutes"]}
          minutesStep={10}
          value={timeSlot[tKey]}
          onChange={(value) => {
            setTimeSlot({
              ...timeSlot,
              [tKey]: value,
            });
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
