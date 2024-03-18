module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      white: "#FFFFFF",
      black: "#504538",
      transparent: "transparent",
      primary: "#FBD487",
      // secondary: "#383838",
      secondary: "#DFE0DF",
      body: "#454545",
      subtle: "#707070",
      gray: {
        50: "#F2F2F2",
        100: "#E8E8E8",
        200: "#D1D1D1",
        300: "#BABABA",
        400: "#A3A3A3",
        500: "#8C8C8C",
        600: "#707070",
        700: "#545454",
        800: "#383838",
        900: "#1C1C1C",
        950: "#0D0D0D",
      },
      green: {
        50: "#F2F9EC",
        100: "#E7F3DD",
        200: "#CCE6B7",
        300: "#B4DB94",
        400: "#9CCF72",
        500: "#84C34F",
        600: "#68A438",
        700: "#4E7A29",
        800: "#33501B",
        900: "#1B2A0E",
        950: "#0C1306",
      },
      blue: {
        50: "#EBF0FF",
        100: "#D1DEFF",
        200: "#A3BDFF",
        300: "#759CFF",
        400: "#477BFF",
        500: "#1B5BFF",
        600: "#0040E0",
        700: "#0030A8",
        800: "#002070",
        900: "#001038",
        950: "#00091F",
      },
      orange: {
        50: "#FFF4EB",
        100: "#FFEAD6",
        200: "#FFD5AD",
        300: "#FFC085",
        400: "#FFAB5C",
        500: "#FF9736",
        600: "#F57600",
        700: "#B85900",
        800: "#7A3B00",
        900: "#3D1E00",
        950: "#1F0F00",
      },
      red: {
        50: "#FAEBEA",
        100: "#F6D6D5",
        200: "#ECAEAC",
        300: "#E38582",
        400: "#D95D59",
        500: "#D0342F",
        600: "#A62A26",
        700: "#7D1F1C",
        800: "#531513",
        900: "#2A0A09",
        950: "#150505",
      },
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
