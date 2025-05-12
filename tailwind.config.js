/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily:{
        themeFont:["Merriweather", 'serif'],
        bodyFont:["Roboto",'serif']
      },
      backgroundColor: {
        warning: '#f0ad4e',
        success: '#5cb85c',
        error: '#d9534f',
        info: '#5bc0de'
      },colors: {
        bgBase: '#F9FAFB', // Background
        textPrimary: '#111111', // Primary Text
        textSecondary: '#4B5563', // Secondary Text
        accent: {
          DEFAULT: '#14B8A6', // Primary Accent
          hover: '#0F766E',   // Accent Hover
        },
        divider: '#E5E7EB', // Borders/Dividers
      },
    }
  },
  plugins: []
};
