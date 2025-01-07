"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { NextPage } from "next";

const MuiProvider: NextPage<React.PropsWithChildren> = ({ children }) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{
        fieldHoursPlaceholder: () => "~시",
        fieldMinutesPlaceholder: () => "~분",
      }}
    >
      {children}
    </LocalizationProvider>
  );
};

export default MuiProvider;
