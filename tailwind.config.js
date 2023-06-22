/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./layouts/**/*.{js,jsx}", "./blocks/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    container: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        "blue-primary": "#3f66c8",
        "blue-han": "#5677D8",
        "blue-crayola": "#4F7FFA",
        "blue-tiful": "#4772e1",
        "blue-dark": "#21222B",
        "blue-darker": "#222230",
        "green-forest": "#6ba266",
        "green-bud": "#79b773",
        "green-pistachio": "#86CB80",
        "red-shimmer": "#ba4a4f",
        "red-indian": "#d15359",
        "red-sizy": "#E85C63",
        "orange-gold": "#c48a2c",
        "orange-combodge": "#dd9b32",
        "orange-yellow": "#F5AC37",
        "gray-dark": "#4D575F",
        "gray-light": "#EEEFEF",
        "gray-lighter": "#dedede",
        "gray-white": "#EEEDFF",
        "light-hover": '#e5e5e5',

        "success": "#3CDF73",
        "error": "#EF4F4F",
        "warning": "#EFB94F",
        "gray-dark": "#2a2c37",
        "gray-darker": "#373842",
        "gray-light": "#8D8E93",
        "gray-lighter": "#FCFDFF",
        "gray-white": "#EEEDFF",
        "disabled-bg": "#242a40",
        "disabled-txt": "#314378",
        "dark": "#1e202b",
        "blue-light": "#00AFB9",
        "orange": "#FF6542",
        "cyan": "#254E70"
      },
      fontSize: {
        xxs: ["0.625rem", "0.8rem"],
      },
      backgroundImage: {
        "dark-pattern": ["url('../public/dark-pattern.jpg')"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
