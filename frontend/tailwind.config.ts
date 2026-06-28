import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50':  '#fdf2f6',
          '100': '#fbe8f0',
          '200': '#f9d0e2',
          '300': '#f4a8c7',
          '400': '#ec6fa1',
          '500': '#C2517A',   // اللون الرئيسي — وردي
          '600': '#a8365f',
          '700': '#8c2a4f',
          '800': '#752642',
          '900': '#62223a',
        },
        secondary: {
          '50':  '#f0effd',
          '100': '#e3e2fb',
          '200': '#cccaf7',
          '300': '#aaa6f0',
          '400': '#9490e7',
          '500': '#7F77DD',   // اللون الثانوي — بنفسجي
          '600': '#6059c4',
          '700': '#4e44ab',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config