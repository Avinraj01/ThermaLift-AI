/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        akt: {
          // Primary backgrounds
          void: '#080B10',
          base: '#101520',
          surface: '#141B28',
          card: '#161D2A',
          // Borders & dividers
          border: '#1E2638',
          borderHover: '#2A3548',
          // Brand accents
          flame: '#FF6B00',
          amber: '#FF8C00',
          cyan: '#00D2FF',
          crimson: '#E63946',
          emerald: '#10B981',
          // Text
          heading: '#F1F5F9',
          body: '#94A3B8',
          muted: '#64748B',
          dim: '#475569',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        montserrat: ['Montserrat Alternates', 'sans-serif'],
        display: ['Montserrat Alternates', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Grotesk', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'akt-glow': '0 0 30px -5px rgba(255, 107, 0, 0.25)',
        'akt-card': '0 4px 24px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 38, 56, 0.8)',
        'akt-hover': '0 8px 32px -4px rgba(255, 107, 0, 0.15), 0 0 0 1px rgba(255, 107, 0, 0.3)',
        'akt-cyan': '0 0 20px -5px rgba(0, 210, 255, 0.35)',
        'akt-crimson': '0 0 20px -5px rgba(230, 57, 70, 0.4)',
      },
      animation: {
        'ticker': 'ticker 45s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'count-up': 'countUp 1.5s ease-out forwards',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
