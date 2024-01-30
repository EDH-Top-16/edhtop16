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
        purple: {
          400: "#2A274D",
        },
      },
      spacing: {
        nav: "6rem",
      },
    },
  },
  plugins: [require("tailwindcss-react-aria-components")],
};
