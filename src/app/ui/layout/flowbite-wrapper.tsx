"use client";
import { ThemeConfig } from "flowbite-react";

import { createTheme, ThemeProvider } from "flowbite-react";
import React from "react";

const flowbiteTheme = createTheme({
  button: {
    color: {
      primary:
        "bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500",
    },
  },
});

const FlowbiteWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={flowbiteTheme}>
      <ThemeConfig dark={false} />
      {children}
    </ThemeProvider>
  );
};

export default FlowbiteWrapper;
