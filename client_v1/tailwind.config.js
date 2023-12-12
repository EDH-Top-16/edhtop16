/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
      dropShadow: {
        nav: "4px 0px 4px rgba(0, 0, 0, 0.5)",
      },
      boxShadow: {
        innerdeep: '#586C8A30 2px 2px 4px inset, white -3px -3px 4px inset',
        icnbtn: '-6px -6px 6px rgba(255, 255, 255, 0.5), 6px 6px 10px rgba(109, 129, 161, 0.25)',
        modal: '4px 4px 7px rgba(0, 0, 0, 0.07), -4px -4px 13px rgba(0, 0, 0, 0.07), 6px 6px 36px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
  darkMode: "class",
};
