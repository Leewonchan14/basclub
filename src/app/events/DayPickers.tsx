"use client";

import { useSelectedDate } from "@/app/ui/share/SelectedDate";
import { day_js } from "@/share/lib/dayjs";
import { ButtonHTMLAttributes } from "react";
import {
  CalendarDay,
  DayPicker,
  getDefaultClassNames,
  Modifiers,
  useDayPicker,
} from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";

export const DayPickers = () => {
  const defaultClassNames = getDefaultClassNames();
  const {selectedDate, setSelectedDate} = useSelectedDate();

  return (
    <DayPicker
      captionLayout="dropdown"
      mode="single"
      showOutsideDays
      locale={ko}
      selected={selectedDate?.toDate()}
      onSelect={setSelectedDate}
      classNames={{
        today: `${defaultClassNames.today} !text-orange-600`,
        month_grid: `${defaultClassNames.month_grid} w-full`,
        month: `${defaultClassNames.month} w-full`,
        months: `${defaultClassNames.months} !max-w-none`,
        day: `${defaultClassNames.day} !text-lg !font-bold`,
        outside: `${defaultClassNames.outside} !text-lg !text-gray-400`,
        day_button: `${defaultClassNames.day_button} !inline-flex !relative !mx-auto !border-none`,
        weekday: `${defaultClassNames.weekday} !font-bold !text-lg`,
        month_caption: `${defaultClassNames.month_caption} justify-center !text-xl`,
        nav: `${defaultClassNames.nav} w-full gap-48 justify-center`,
      }}
      components={{
        DayButton: (props) => <CustomNode {...props} />,
      }}
    />
  );
};

type CustomNodeProps = {
  day: CalendarDay;
  modifiers: Modifiers;
} & ButtonHTMLAttributes<HTMLButtonElement>;
const CustomNode: React.FC<CustomNodeProps> = ({
  day,
  className,
  modifiers: _,
  ...props
}) => {
  const { selected } = useDayPicker();
  const isSelected = selected && day_js(selected).isSame(day.date, "day");
  const isExist = day_js("2025-01-02").isSame(day.date, "day");

  return (
    <button
      className={className + " " + (isSelected && "!bg-orange-600 !text-white")}
      {...props}
    >
      {props.children}
      {isExist && (
        <div
          className={`absolute w-2 h-2 bg-orange-600 rounded-full bottom-1 ${
            isSelected && "!bg-white"
          }`}
        />
      )}
    </button>
  );
};
