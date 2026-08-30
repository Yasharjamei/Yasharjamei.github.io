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
      },
      fontFamily: {
        sans: ['var(--font-noto)'],
      },
      maxWidth: {
        shell: "1240px",
      },
    },
  },
  plugins: [],
} satisfies Config;
