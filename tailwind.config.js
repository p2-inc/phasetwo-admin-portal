/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        p2blue: {
          100: "#F9FCFE",
          200: "#EDF5FB",
          500: "#5B9FDD",
          700: "#1570C2",
          900: "#3C474E",
        },
        p2gray: {
          900: "#252627"
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
