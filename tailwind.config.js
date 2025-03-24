/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans your project files
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#1e3a8a",
          medium: "#3730a3",
          light: "#93c5fd",
          accent: "#3b82f6",
        },
        secondary: {
          orange: "#f59e0b",
          yellow: "#fbbf24",
          "orange-dark": "#ea580c",
          purple: "#8b5cf6",
        },
        status: {
          success: "#10b981",
          "success-light": "#d1fae5",
          danger: "#ef4444",
          "danger-light": "#fee2e2",
          warning: "#f59e0b",
          "warning-light": "#fef3c7",
        },
        neutral: {
          white: "#ffffff",
          gray50: "#f9fafb",
          gray100: "#f3f4f6",
          gray200: "#e5e7eb",
          gray400: "#9ca3af",
          gray600: "#4b5563",
          gray800: "#1f2937",
          "blue-gray-50": "#f8fafc",
          "blue-gray-100": "#f1f5f9",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
