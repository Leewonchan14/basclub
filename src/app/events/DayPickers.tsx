"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { day_js } from "@/share/lib/dayjs";
import { ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler } from "react";
import {
  CalendarDay,
  DayPicker,
  Modifiers,
  Nav,
  Week,
  WeekProps,
  getDefaultClassNames,
  useDayPicker,
} from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";

export const DayPickers = () => {
  const defaultClassNames = getDefaultClassNames();
  const { selectedDate, setSelectedDate } = useSelectedDate();

  return (
    <DayPicker
      captionLayout="dropdown"
      mode="single"
      showOutsideDays
      locale={ko}
      month={selectedDate.toDate()}
      selected={selectedDate.toDate()}
      onSelect={(date) => date && setSelectedDate(date)}
      onMonthChange={(month) => {
        if (selectedDate.format("YYYY-MM") === day_js(month).format("YYYY-MM"))
          return;
        setSelectedDate(
          day_js(month).set("date", selectedDate.get("date")).toDate()
        );
      }}
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
        Week: (props) => <CurrentWeekRow {...props} />,
        Nav: (props) => <CusTomNav {...props} />,
      }}
    />
  );
};

const CusTomNav = (
  props: {
    onPreviousClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    onNextClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    previousMonth?: Date | undefined;
    nextMonth?: Date | undefined;
  } & HTMLAttributes<HTMLElement>
) => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  return (
    <Nav
      {...props}
      onPreviousClick={(_e) => {
        const pre = selectedDate.subtract(1, "week");
        setSelectedDate(pre.toDate());
      }}
      onNextClick={(_e) => {
        const next = selectedDate.add(1, "week");
        setSelectedDate(next.toDate());
      }}
    />
  );
};

function CurrentWeekRow(props: WeekProps) {
  const { selectedDate } = useSelectedDate();
  const isSameWeek = day_js(props.week.days[0].date).isSame(
    selectedDate,
    "week"
  );
  if (!isSameWeek) return null;
  return <Week {...props} />;
}

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

  const { isLoading, isExist } = useFetchEventsExist();

  return (
    <button
      disabled={isLoading}
      className={`${className} ${
        isSelected && "relative !bg-orange-600 !text-white"
      } disabled:opacity-50`}
      {...props}
    >
      {props.children}

      <div
        className={`absolute bottom-0 w-2 h-2 text-xs rounded-full bg-gray-200 animate-pulse ${
          !isLoading && "invisible"
        }`}
      />

      {isExist(day_js(day.date)) && (
        <div
          className={`absolute w-2 h-2 bg-orange-600 rounded-full bottom-1 ${
            isSelected && "!bg-white"
          }`}
        />
      )}
    </button>
  );
};
