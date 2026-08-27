/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian Black & White Palette
        obsidian: {
          950: '#050505', // Pitch Black Canvas
          900: '#09090b', // Deep Obsidian
          850: '#121215', // Dark Charcoal Surface
          800: '#18181b', // Elevated Hover
        },
        // Keep zinc for borders and muted elements
        // White stays as #ffffff
        // Custom semantic colors
        success: {
          950: '#0a2f1f', // Emerald dark bg
          800: '#14532d', // Emerald dark border
          400: '#4ade80', // Emerald text
        },
        warning: {
          950: '#2f0a0a', // Crimson dark bg
          800: '#7f1d1d', // Crimson dark border
          400: '#f87171', // Crimson text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
      boxShadow: {
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.1)',
        'glow-white-lg': '0 0 40px rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
