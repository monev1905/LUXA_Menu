/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'card': ['CardFont', 'sans-serif'],
        'lastic': ['Lastic', 'sans-serif'],
      },
      colors: {
        jungle: "#233524",         // main background
        'jungle-dark': "#1a241b",  // header, overlays
        'jungle-light': "#2e3d3a", // cards, panels
        leaf: "#3d5a3a",           // buttons, highlights
        olive: "#5b6e2d",          // accent, hover
        accent: "#b6c96b",         // yellow-green accent
        brown: "#5a3c2a",          // borders, subtle
        text: "#e6f2e6",           // main text
        'text-secondary': "#b6c96b", // secondary text
        // New background colors
        'sage': "#9caf88",         // light sage green
        'moss': "#6b7c3d",         // moss green
        'forest': "#2d4a3e",       // deep forest green
        'cream': "#f5f5dc",        // cream background
        'warm-gray': "#8b7355",    // warm gray-brown
      },
    },
  },
  plugins: [],
} 