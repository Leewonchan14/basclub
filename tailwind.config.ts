import flowbiteReact from "flowbite-react/plugin/tailwindcss";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ".flowbite-react/class-list.json",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      spacing: {
        "sidenav-width": "14rem",
        "content-width": "1024px",
        "mobile-width": "400px",
        "min-content-width": "300px",
      },
    },
  },
  plugins: [flowbiteReact],
};
export default config;
