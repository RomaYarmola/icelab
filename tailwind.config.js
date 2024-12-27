const plugin = require("tailwindcss/plugin");
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "460px",
        sm: "660px",
        md: "768px",
        l: "989px",
        lg: "1150px",
        xl: "1280px",
        "2xl": "1440px",
      },
      colors: {
        white: "#F5F7FF",
        commonBlue: "#001731",
        commonBlue800: "#002E62",
        lightBlue: "#A8D0FD",
      },
      backgroundImage: {
        "gradient-btn":
          "linear-gradient(274deg, #001731 -19.59%, #1256A3 62.1%, #B0D5FF 117.71%)",
        "bg-dark-gradient":
          "linear-gradient(0deg, #001731 11.33%, #EAF3FF 79.67%)",
        "gradient-card":
          "linear-gradient(145deg, #79A8DC -2.31%, #001731 94.64%)",
        "dark-gradient": "linear-gradient(90deg, #001731 0%, #214D7E 148.78%)",
        "hr-gradient":
          "linear-gradient(94deg, #C4CDEC -19.3%, #3B5690 46.94%, #082142 108.08%)",
        "about-gradient":
          "linear-gradient(5deg, #001731 -2.03%, #97CBFF 281.84%)",
        "modal-gradient": "linear-gradient(94deg, #FFF 37.6%, #D9EBFF 212.19%)",
      },
      boxShadow: {
        btn: "0px 3px 12px 0px rgba(0, 23, 49, 0.35) inset",
        card: "0px 4px 22px 0px rgba(0, 23, 49, 0.26), -1px -5px 10.3px 2px rgba(255, 255, 255, 0.11) inset, 0px 3px 4px 0px rgba(0, 23, 49, 0.18) inset",
        modal: "0px 10px 56px 2px rgba(121, 121, 121, 0.12)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        michelin: ["Michelin", "sans-serif"],
      },
      fontSize: {
        xs: ["14px", { lineHeight: "1.42", fontWeight: "500" }],
        "xs-responsive": ["clamp(14px, 1.4vw, 16px)", { lineHeight: "1.5" }],
        "sm-responsive": ["clamp(14px, 1.6vw, 18px)"],
        base: ["16px"],
        "base-extended": ["16px", { lineHeight: "1.25", fontWeight: "600" }],
        "md-responsive": [
          "clamp(16px, 1.5vw, 20px)",
          { textTransform: "uppercase" },
        ],
        lg: ["18px", { fontWeight: "500" }],
        "lg-responsive": [
          "clamp(18px, 1.78vw, 20px)",
          { lineHeight: "1.5", fontWeight: "500", textTransform: "uppercase" },
        ],
        "lg-extended": [
          "clamp(18px, 2.5vw, 28px)",
          {
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.56px",
          },
        ],
        xl: [
          "clamp(24px, 2.85vw, 32px)",
          { fontWeight: "500", textTransform: "uppercase" },
        ],
        "xl-heading": [
          "clamp(24px, 3.57vw, 40px)",
          { textTransform: "uppercase" },
        ],
        "2xl": [
          "clamp(32px, 4.28vw, 48px)",
          { fontWeight: "500", textTransform: "uppercase" },
        ],
        "3xl": [
          "clamp(32px, 6vw, 88px)",
          { fontWeight: "500", textTransform: "uppercase" },
        ],
        "4xl": [
          "clamp(58px, 8.6vw, 96px)",
          { fontWeight: "500", textTransform: "uppercase" },
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".base-text": {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "16px",
          fontStyle: "normal",
        },
        ".main-title-gradient": {
          background:
            "linear-gradient(94deg, #C4CDEC -19.3%, #3B5690 46.94%, #082142 108.08%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-blue-gradient": {
          background: "linear-gradient(90deg, #061B3B 0%, #3B5690 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-white-gradient": {
          background: "linear-gradient(98deg, #EFF6FF 24.36%, #004797 229.13%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-white-title-gradient": {
          background: "linear-gradient(91deg, #F5F7FF 0.87%, #8D9BD5 117.25%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-secondary-white-gradient": {
          background: "linear-gradient(91deg, #F5F7FF 0.87%, #BFCCFF 117.25%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-thin-gradient": {
          background: "linear-gradient(90deg, #A6D0FF 0%, #4E98EA 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-light-blue-gradient": {
          background:
            "linear-gradient(0deg, #A4CFFF -107.27%, #F5F7FF 265.97%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-violet-gradient": {
          background:
            "linear-gradient(90deg, #2D48A1 -16.4%, #8FAEF1 51.75%, #082142 112.37%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-dark-gradient": {
          background:
            "linear-gradient(159deg, #001731 -125.16%, #184B84 215.7%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".text-basket-gradient": {
          background: "linear-gradient(90deg, #061B3B 0.01%, #3B5690 26.11%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },

        ".border-gradient-rounded": {
          border: "1px solid transparent",
          borderRadius: "6px",
          background:
            "linear-gradient(145deg, #79A8DC -2.31%, #001731 94.64%), linear-gradient(94deg, #A8D0FD 0%, #004CA2 100%)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
        },
        ".border-gradient-modal": {
          border: "1px solid transparent",
          borderRadius: "4px",
          background:
            "linear-gradient(to right, #FFF,#FFF), linear-gradient(to right, #C4CDEC, #3B5690, #082142)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
        },
        ".border-gradient-blue-bg-modal": {
          border: "1px solid transparent",
          borderRadius: "4px",
          background:
            "linear-gradient(91deg, #F5F7FF 0.87%, #8D9BD5 117.25%), linear-gradient(to right, #C4CDEC, #3B5690, #082142)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
        },
        ".border-white-gradient-rounded": {
          border: "1px solid transparent",
          borderRadius: "6px",
          background:
            "linear-gradient(to right, #F5F7FF,#F5F7FF), linear-gradient(94deg, #A8D0FD 0%, #004CA2 100%)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
        },
        ".modal-bg": {
          background: "linear-gradient(94deg, #FFF 37.6%, #D9EBFF 212.19%)",
          boxShadow: "0px 10px 56px 2px rgba(13, 59, 111, 0.17)",
        },
        ".second-modal-bg": {
          background: "linear-gradient(134deg, #FFF -1.67%, #CCE4FF 172.98%)",
          boxShadow: " 0px 10px 56px 2px rgba(121, 121, 121, 0.12)",
        },
        ".third-modal-bg": {
          background:
            "linear-gradient(28deg, #C4CDEC -26.14%, #3B5690 28.01%, #082142 78%)",
          boxShadow: " 0px 10px 56px 2px rgba(121, 121, 121, 0.12)",
        },
        ".basket-bg": {
          background: "linear-gradient(119deg, #FFF 5.36%, #E6F2FF 170.63%)",
          boxShadow: "0px 10px 56px 2px rgba(12, 62, 118, 0.17)",
        },
      });
    }),
  ],
};
