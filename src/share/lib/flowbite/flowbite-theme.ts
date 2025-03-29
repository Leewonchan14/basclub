"use client";
import { createTheme } from "flowbite-react";

const flowbiteTheme = createTheme({
  button: {
    color: {
      primary:
        "text-white bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 focus:ring-2",
    },
  },
});

export default flowbiteTheme;
