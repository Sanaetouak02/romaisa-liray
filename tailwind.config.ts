import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0334B3',
        secondary: '#2B4CA3',
        metal: '#9F9F9F',
        darkGray: '#676769',
        lightGray: '#D9D9D9',
        drop: '#2B4CA3',
        dropShine: '#97ACE3',
        page: '#FEFEFE',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(3, 52, 179, 0.16)',
      },
    },
  },
  plugins: [],
}

export default config
