/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#312D5A",
        secondary: "#514F86",
        tertiary: "#B7B5FF",
        quaternary: "#F4F4F2",
        white: "#F4F4F2",
        black: "#19191A",
        gray: "#606883",
      },
      spacing: {
        nav: "12rem",
      },
    },
  },
  plugins: [],
};
