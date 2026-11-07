import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#183D2B",
          light: "#3F6849",
        },
        primary: {
          DEFAULT: "#3F6849",
          dark: "#183D2B",
          light: "#91A88B",
          foreground: "#FFFFFF",
        },
        sage: {
          DEFAULT: "#91A88B",
          soft: "#F0F2EB",
        },
        background: "#F4F3EA",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F0F2EB",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#202820",
        },
        muted: {
          DEFAULT: "#F0F2EB",
          foreground: "#737C73",
        },
        foreground: "#202820",
        "text-primary": "#202820",
        "text-secondary": "#737C73",
        "text-muted": "#9AA198",
        border: "#E2E5DC",
        input: "#E2E5DC",
        ring: "#3F6849",
        success: {
          DEFAULT: "#39865A",
          subtle: "#EAF4EE",
        },
        warning: {
          DEFAULT: "#E5A23C",
          subtle: "#FDF5E8",
        },
        danger: {
          DEFAULT: "#D85B55",
          subtle: "#FDECEB",
        },
        info: {
          DEFAULT: "#5686B7",
          subtle: "#ECF2F8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "10px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "14px",
      },
      fontSize: {
        "page-title": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        "page-title-lg": ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "section-title": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "card-title": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem" }],
        caption: ["0.78125rem", { lineHeight: "1.15rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
