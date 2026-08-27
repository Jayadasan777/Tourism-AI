/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Palette
        base: {
          bg: '#0A0B10',       // near-black base
          card: '#12131C',     // card surface
          elevated: '#1A1B26', // elevated hover
          border: '#232536',   // subtle border
        },
        accent: {
          violet: '#7C5CFF',   // AI / tech accent — primary
          marigold: '#FF8A3D', // India / warmth accent — secondary
          teal: '#1DD3B0',     // safety / live-data elements only
        },
        text: {
          primary: '#F5F3EF',  // warm off-white
          muted: '#9A9AA5',    // muted secondary text
        },
        // Backwards compatibility
        obsidian: {
          950: '#0A0B10',
          900: '#12131C',
          850: '#1A1B26',
          800: '#232536',
        }
      },
      fontFamily: {
        display: ['Syne', 'Cabinet Grotesk', 'sans-serif'],
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      boxShadow: {
        'glow-violet': '0 0 25px rgba(124, 92, 255, 0.25)',
        'glow-violet-lg': '0 0 45px rgba(124, 92, 255, 0.4)',
        'glow-marigold': '0 0 25px rgba(255, 138, 61, 0.25)',
        'glow-teal': '0 0 25px rgba(29, 211, 176, 0.25)',
        'glow-white': '0 0 20px rgba(245, 243, 239, 0.1)',
      },
      animation: {
        'pulse-teal': 'pulseTeal 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseTeal: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
