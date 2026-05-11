import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-gold': '#c9a84c',
        'royal-cream': '#f5f0e8',
        'royal-navy': '#0a0e1a',
        'royal-dark': '#0a0a0f',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Copperplate', 'Copperplate Gothic', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
