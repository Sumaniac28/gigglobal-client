/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        themeFont: ['Montserrat', 'serif'],
        bodyFont: ['Cabin', 'serif']
      },
      backgroundColor: {
        warning: '#f0ad4e',
        success: '#5cb85c',
        error: '#d9534f',
        info: '#5bc0de'
      },
      colors: {
        background: '#F5FAFA',
        surface: '#FFFFFF',
        primary: '#008080',
        'primary-hover': '#006666',
        secondary: '#4B0082',
        'secondary-hover': '#3A0066',
        accent: '#00BFA6',
        'accent-hover': '#009E8A',
        muted: '#6B7280',
        'on-primary': '#FFFFFF',
        'border-default': '#E2E8F0'
      }
    }
  },
  plugins: []
};
