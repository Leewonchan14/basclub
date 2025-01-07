"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js } from "@/share/lib/dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { NextPage } from "next";

const InputTime: NextPage<{}> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-2xl font-bold">일정 시간</div>
      <div className="flex flex-col gap-4 md:flex-row ">
        <TPicker tKey={"start"} text={"시작"} />
        <TPicker tKey={"end"} text={"끝"} />
      </div>
    </div>
  );
};

interface TPickerProps {
  tKey: keyof TimeSlot;
  text: string;
}

const TPicker: React.FC<TPickerProps> = ({ tKey, text }) => {
  const { timeSlot, setTimeSlot } = useEventCreateContext();

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
    <TimePicker
      label={text}
      value={timeSlot[tKey]}
      onChange={(value) => {
        if (!value || !tKey) return;
        setTimeSlot({ ...timeSlot, [tKey]: value });
      }}
      ampm={false}
      minutesStep={10}
      {...{
        ...{},
      }}
      {...timeLimit}
    />
  );
};

export default InputTime;
