/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        error: "#ba1a1a",
        "on-tertiary-fixed-variant": "#404754",
        "on-primary": "#ffffff",
        "secondary-fixed": "#71f8e4",
        "surface-container-lowest": "#ffffff",
        "on-primary-container": "#90a8ff",
        "on-error": "#ffffff",
        "surface-container-highest": "#e0e3e5",
        "surface-container-low": "#f2f4f6",
        "surface-dim": "#d8dadc",
        "tertiary-fixed-dim": "#c0c7d6",
        "on-primary-fixed-variant": "#264191",
        "surface-container-high": "#e6e8ea",
        "on-background": "#191c1e",
        "on-surface-variant": "#444651",
        background: "#f7f9fb",
        "on-secondary-fixed-variant": "#005048",
        "primary-fixed-dim": "#b6c4ff",
        "secondary-container": "#6df5e1",
        "tertiary-fixed": "#dce2f3",
        "outline-variant": "#c5c5d3",
        secondary: "#006b5f",
        "on-secondary-container": "#006f64",
        surface: "#f7f9fb",
        "inverse-surface": "#2d3133",
        "primary-container": "#1e3a8a",
        outline: "#757682",
        "on-tertiary": "#ffffff",
        "surface-bright": "#f7f9fb",
        "primary-fixed": "#dce1ff",
        "on-tertiary-fixed": "#151c27",
        tertiary: "#232a36",
        "surface-container": "#eceef0",
        "inverse-on-surface": "#eff1f3",
        "on-secondary": "#ffffff",
        "secondary-fixed-dim": "#4fdbc8",
        "tertiary-container": "#39404d",
        "on-secondary-fixed": "#00201c",
        "inverse-primary": "#b6c4ff",
        "error-container": "#ffdad6",
        "on-surface": "#191c1e",
        "surface-tint": "#4059aa",
        "on-error-container": "#93000a",
        "surface-variant": "#e0e3e5",
        primary: "#00236f",
        "on-tertiary-container": "#a5acbb",
        "on-primary-fixed": "#00164e",
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        gutter: "24px",
        "container-max": "1440px",
      },

      fontFamily: {
        "display-lg": ["Manrope", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        "title-md": ["Manrope", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Manrope", "sans-serif"],
      },

      fontSize: {
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],

        "body-lg": [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "400",
          },
        ],

        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],

        "title-md": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],

        "body-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],

        "label-md": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.01em",
            fontWeight: "500",
          },
        ],

        "label-sm": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "600",
          },
        ],

        "headline-lg-mobile": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "600",
          },
        ],
      },
    },
  },

  plugins: [],
};