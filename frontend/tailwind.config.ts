import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          'red-light': '#fef2f2',
          navy: '#0a1628',
          blue: '#1e3a5f',
          'blue-mid': '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        head: ['Syne', 'sans-serif'],
        telugu: ['"Tiro Telugu"', 'serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
