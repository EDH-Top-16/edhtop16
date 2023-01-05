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
        subtext: "#514F86",
        searchbar: "#DEDFFF",
      },
      dropShadow: {
        nav: "4px 0px 4px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
