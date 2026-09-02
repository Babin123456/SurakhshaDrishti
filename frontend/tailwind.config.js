/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050914',
          900: '#08111F',
          800: '#0D1A2D',
          700: '#12233B',
          600: '#1A2E4A',
        },
        hazard: {
          critical: '#E53E3E',
          criticalGlow: 'rgba(229, 62, 62, 0.3)',
          high: '#F59E0B',
          highGlow: 'rgba(245, 158, 11, 0.25)',
          caution: '#ECC94B',
          safe: '#38A169',
          safeGlow: 'rgba(56, 161, 105, 0.2)',
          info: '#06B6D4',
          infoGlow: 'rgba(6, 182, 212, 0.2)',
        },
        glass: {
          DEFAULT: 'rgba(13, 26, 45, 0.75)',
          light: 'rgba(26, 46, 74, 0.5)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        italianno: ['"Italianno"', 'cursive'],
        cambria: ['"Cambria Math"', 'Cambria', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'radar-pulse': 'radarPulse 3s ease-out infinite',
        'radar-pulse-delay': 'radarPulse 3s ease-out 1s infinite',
        'hazard-glow': 'hazardGlow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'counter-tick': 'counterTick 0.15s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'glow-line': 'glowLine 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        radarPulse: {
          '0%': { transform: 'scale(0.5)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        hazardGlow: {
          '0%': { boxShadow: '0 0 15px rgba(229, 62, 62, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(229, 62, 62, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        counterTick: {
          '0%': { transform: 'scale(1.15)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowLine: {
          '0%': { opacity: '0.4', filter: 'brightness(0.8)' },
          '100%': { opacity: '1', filter: 'brightness(1.3)' },
        },
      },
      backdropBlur: {
        glass: '16px',
      },
      backgroundSize: {
        'gradient-shift': '200% 200%',
      },
    },
  },
  plugins: [],
};
