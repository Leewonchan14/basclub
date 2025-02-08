"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { day_js } from "@/share/lib/dayjs";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Accordion, AccordionDetails, styled } from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";

import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useState } from "react";

export const LastEvents = () => {
  const { lastEvents, onChangeEvents } = useEventCreateContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((prev) => !prev)}
      className="!shadow-none before:!invisible !bg-none !w-full"
    >
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <div className="text-xl font-bold text-orange-500">
          최근 일정 복사하기
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col gap-2">
          {lastEvents.map((e) => (
            <button
              onClick={() => {
                onChangeEvents(e.id);
                setExpanded(false);
              }}
              className="flex flex-col items-start gap-2 p-2 transition-colors duration-200 border-2 rounded-lg text-start hover:bg-orange-500 hover:text-white"
              key={e.id}
            >
              <div className="text-lg font-bold">
                {day_js(e.date).format("MM월 DD일 ddd요일")}
              </div>
              <div>{e.address}</div>
              <div>{e.detailAddress}</div>
              <div>
                {day_js(e.timeSlot.start).format("HH:mm")} ~{" "}
                {day_js(e.timeSlot.end).format("HH:mm")}
              </div>
            </button>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  padding: "0 0",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));
