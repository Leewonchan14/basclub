"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { day_js } from "@/share/lib/dayjs";
import { Tooltip } from "flowbite-react";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import {
  CalendarDay,
  DayPicker,
  Modifiers,
  getDefaultClassNames,
  useDayPicker,
} from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { IoCalendarOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface DayPickersProps {}

export const DayPickers: React.FC<DayPickersProps> = ({}) => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [accordionHeight, setAccordionHeight] = useState(
    accordionRef.current?.scrollHeight ?? 0,
  );
  const isClose = !isOpen;
  const defaultClassNames = getDefaultClassNames();
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (accordionRef.current) {
      setAccordionHeight(accordionRef.current.scrollHeight);
    }
  }, [selectedDate]);

  return (
    <div
      className={`rounded-lg bg-white p-4 shadow-md transition-all ${isClose && "cursor-pointer"}`}
      onClick={() => isClose && setIsOpen(!isOpen)}
    >
      <Tooltip
        content="날짜를 선택하세요"
        style="light"
        placement="bottom"
        theme={{ target: "w-full" }}
      >
        <div
          className="flex w-full cursor-pointer items-center justify-between gap-2 text-xl font-extrabold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen && (
            <MdKeyboardArrowDown className="text-2xl font-extrabold" />
          )}
          {isOpen && <MdKeyboardArrowUp className="text-2xl font-extrabold" />}
          {day_js(selectedDate.toDate()).format("YYYY년 MM월 DD일 ddd요일")}
          <IoCalendarOutline className="text-2xl font-extrabold" />
        </div>
      </Tooltip>
      <div
        ref={accordionRef}
        className={"overflow-hidden transition-all duration-500"}
        style={{ height: isOpen ? accordionHeight : 0 }}
      >
        <hr className="my-2" />
        <DayPicker
          captionLayout="dropdown"
          mode="single"
          showOutsideDays
          locale={ko}
          month={selectedDate.toDate()}
          selected={selectedDate.toDate()}
          onSelect={(date) => {
            setSelectedDate(date);
            onClose();
          }}
          onMonthChange={(month) => {
            if (
              selectedDate.format("YYYY-MM") === day_js(month).format("YYYY-MM")
            )
              return;

            // 각 월의 최대 일자를 구해서 그 일자를 넘어가면 그 일자로 설정
            const maxDate = day_js(month).endOf("month").date();
            const currentDate = selectedDate.get("date");
            if (currentDate > maxDate) {
              setSelectedDate(day_js(month).set("date", maxDate).toDate());
            } else {
              setSelectedDate(
                day_js(month).set("date", selectedDate.get("date")).toDate(),
              );
            }
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
          }}
        />
      </div>
    </div>
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
        className={`absolute bottom-0 h-2 w-2 animate-pulse rounded-full bg-gray-200 text-xs ${
          !isLoading && "invisible"
        }`}
      />

      {isExist(day_js(day.date)) && (
        <div
          className={`absolute bottom-1 h-2 w-2 rounded-full bg-orange-600 ${
            isSelected && "!bg-white"
          }`}
        />
      )}
    </button>
  );
};
