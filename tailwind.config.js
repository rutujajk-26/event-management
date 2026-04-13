/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'hero-glow': '0 40px 120px rgba(45, 212, 191, 0.18)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(18px, -14px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 18px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(56, 189, 248, 0.25)' },
          '50%': { boxShadow: '0 0 60px rgba(56, 189, 248, 0.6)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        blob: 'blob 12s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        glow: 'glow 2.8s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.9s ease-out forwards',
        pulseScale: 'pulseScale 4.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
