"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchEventsExist } from "@/feature/events/hooks/useFetchEventsExist";
import { day_js } from "@/share/lib/dayjs";
import { Tooltip } from "flowbite-react";
import React, {
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { MdKeyboardArrowDown } from "react-icons/md";

interface DayPickersProps {}

const DayPickers: React.FC<DayPickersProps> = ({}) => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [accordionHeight, setAccordionHeight] = useState<string | number>(
    "auto",
  );
  const isClose = !isOpen;
  const defaultClassNames = getDefaultClassNames();
  const { selectedDate, setSelectedDate } = useSelectedDate();

  useEffect(() => {
    if (accordionRef.current) {
      setAccordionHeight(accordionRef.current.scrollHeight);
    }
  }, [selectedDate]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`rounded-lg bg-white p-4 shadow-md transition-all ${isClose && "cursor-pointer"}`}
      onClick={() => isClose && setIsOpen(!isOpen)}
    >
      <Tooltip
        content="날짜를 선택하세요"
        style="light"
        placement="top"
        theme={{ target: "w-full" }}
      >
        <div
          className="flex w-full cursor-pointer items-center justify-between text-lg font-extrabold lg:text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdKeyboardArrowDown
            className={`text-2xl font-extrabold transition-all duration-300 ${isOpen && "rotate-180"}`}
          />
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
            if (date) setSelectedDate(date);
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
            day: `${defaultClassNames.day} !relative`,
            outside: `${defaultClassNames.outside} !text-gray-400`,
            weekday: `${defaultClassNames.weekday} !font-bold !text-lg`,
            month_caption: `${defaultClassNames.month_caption} justify-center !text-lg lg:!text-xl`,
            nav: `${defaultClassNames.nav} w-full gap-48 justify-center`,
          }}
          components={{
            DayButton: (props) => (
              <CustomNode isMounted={isMounted} {...props} />
            ),
          }}
        />
        <PrimaryButton
          onClick={() => setIsOpen(false)}
          className="flex !h-auto w-full cursor-pointer items-center justify-center !py-0 focus:ring-0"
        >
          <MdKeyboardArrowDown className="rotate-180 text-2xl font-extrabold transition-all duration-300" />
        </PrimaryButton>
      </div>
    </div>
  );
};

export default DayPickers;

type CustomNodeProps = {
  day: CalendarDay;
  modifiers: Modifiers;
  isMounted: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const CustomNode: React.FC<CustomNodeProps> = React.memo(
  ({ day, className, isMounted, modifiers: _, ...props }) => {
    const { selected } = useDayPicker();

    const isSelected = selected && day_js(selected).isSame(day.date, "day");

    const { isLoading, isExist } = useFetchEventsExist();

    return (
      <>
        <div
          className={`!m-auto !aspect-square !h-8 !w-auto !border-none lg:!h-10 ${isSelected && "!bg-orange-600 !text-white"} ${className}`}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {props.children}

          {(!isMounted || isLoading) && (
            <div
              className={`absolute bottom-[7px] h-2 w-2 animate-pulse rounded-full bg-gray-200 text-xs lg:bottom-0`}
            />
          )}
        </div>
        {isExist(day_js(day.date)) && (
          <div
            className={`absolute bottom-[7px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-orange-600 lg:bottom-1 ${isSelected && "!bg-white"}`}
          />
        )}
      </>
    );
  },
);
