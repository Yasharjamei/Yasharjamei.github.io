import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        hairline: "var(--hairline)",
        accent: "var(--accent)",
        // Theme-aware hover/raised surface. Never hardcode a hover colour:
        // a literal like #111111 is invisible under dark text in light mode.
        elevated: "var(--elevated)",
      },
      fontFamily: {
        sans: ['var(--font-noto)'],
      },
      maxWidth: {
        shell: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
