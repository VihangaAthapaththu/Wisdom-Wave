import { tokens } from "./src/theme/tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.brand,
        secondary: {
          DEFAULT: "#2563eb",
        },
        bg: {
          DEFAULT: tokens.semanticTheme?.light?.surface || "#ffffff",
          paper: tokens.semanticTheme?.light?.background || "#faf8f5",
          surface: tokens.semanticTheme?.light?.surfaceAlt || "#f7f3ec",
        },
        border: {
          DEFAULT: tokens.semanticTheme?.light?.border || "#e7dfd0",
          light: "#efe8dc",
        },
        muted: {
          DEFAULT: "#5b6472",
          hint: "#94a3b8",
        },
        text: {
          DEFAULT: tokens.semanticTheme?.light?.text || "#0f172a",
          strong: "#111827",
        },
        danger: tokens.colors.danger[500],
        success: tokens.colors.success[500],
        warn: {
          DEFAULT: tokens.colors.warning[500],
          alt: tokens.colors.warning[600],
        },
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans,
      },
      fontSize: {
        ...tokens.typography.scale,
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      boxShadow: {
        "brand-md": tokens.shadows.brand,
        soft: tokens.shadows.soft,
        card: tokens.shadows.card,
        elevated: tokens.shadows.elevated,
      },
      borderRadius: tokens.radius,
      spacing: tokens.spacing,
    },
  },
  plugins: [],
}
