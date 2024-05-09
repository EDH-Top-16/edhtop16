/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/assets/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#312D5A",
        secondary: "#514F86",
        tertiary: "#B7B5FF",
        quaternary: "#F4F4F2",
        purple: { 400: "#2A274D" },
        bg_primary: "#2A2655",
        nav: "#514F86",
        banner: "#312D5A",
        text: "#B7B5FF",
        lightText: "#8380ff",
        subtext: "#514F86",
        searchbar: "#DEDFFF",
        suggestions: "#7D7BB0",
        highlight: "#F87171",
        select: "#434273",
        white: "#F4F4F2",
        gray: "#606883",
        accent: "#6CA6EA",
        voilet: "#514F86",
        cadet: "#2A2655",
      },
      spacing: {
        nav: "6rem",
      },
      dropShadow: {
        nav: "4px 0px 4px rgba(0, 0, 0, 0.5)",
      },
      boxShadow: {
        innerdeep: "#586C8A30 2px 2px 4px inset, white -3px -3px 4px inset",
        icnbtn:
          "-6px -6px 6px rgba(255, 255, 255, 0.5), 6px 6px 10px rgba(109, 129, 161, 0.25)",
        modal:
          "4px 4px 7px rgba(0, 0, 0, 0.07), -4px -4px 13px rgba(0, 0, 0, 0.07), 6px 6px 36px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-react-aria-components")],
};
