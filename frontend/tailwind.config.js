/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
          glow: '#6366f1',
        },
        navy: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#0f172a',
          800: '#131b2e',
          750: '#18233c',
          700: '#1e293b',
        },
        cyber: {
          blue: '#00f0ff',
          purple: '#9d4edd',
          pink: '#f72585',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.25)',
        'glow-md': '0 0 25px rgba(99, 102, 241, 0.35)',
        'glow-lg': '0 0 35px rgba(99, 102, 241, 0.45)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.35)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        neural: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.8))' }
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        neural: 'neural 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
