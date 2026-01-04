// tailwind.config.ts
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px', // For very large monitors
        '4xl': '2560px', // For ultra-wide displays
      },
    },
  },
  plugins: [],
};
