/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#F2F5FA',
          100: '#E3E9F2',
          600: '#1E3A66',
          700: '#162E52',
          800: '#0F2444',
          900: '#0B1F3A',
        },
        orange: {
          DEFAULT: '#FF6B00',
          50: '#FFF4ED',
          100: '#FFE4D1',
          500: '#FF7A1A',
          600: '#FF6B00',
          700: '#E55A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(11, 31, 58, 0.06)',
        card: '0 8px 30px rgba(11, 31, 58, 0.08)',
        cardHover: '0 20px 50px rgba(11, 31, 58, 0.15)',
        glow: '0 0 0 1px rgba(255, 107, 0, 0.4), 0 20px 50px rgba(255, 107, 0, 0.18)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'navy-fade': 'linear-gradient(180deg, rgba(11,31,58,0.6) 0%, rgba(11,31,58,0.2) 30%, rgba(11,31,58,0.85) 100%)',
      },
    },
  },
  plugins: [],
}
