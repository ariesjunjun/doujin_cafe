/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#dd6382',   // メイン
        accent: '#ececec',    // アクセントグレー
        secondary: '#fffae5', // イエロー
        text: '#4b5563',      // 
        text2: '#a5a6a7ff',      // 
        room: '#ffe3ecff',      // 
      },
    },
  },
  plugins: [],
};
