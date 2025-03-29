"use client";

import flowbiteTheme from "@/share/lib/flowbite/flowbite-theme";
import { ThemeProvider } from "flowbite-react";
import React from "react";

const FlowbiteWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ThemeProvider theme={flowbiteTheme}>{children}</ThemeProvider>;
};

export default FlowbiteWrapper;
