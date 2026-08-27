/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-Luxury Black & White Monochrome Palette
        base: {
          bg: '#000000',       // Pure OLED Deep Black
          card: '#0A0A0A',     // Minimalist Dark Surface
          elevated: '#141414', // Crisp Elevated Hover Surface
          border: '#222222',   // Sharp Minimal Border
        },
        accent: {
          violet: '#FFFFFF',   // Primary Button: Pure Crisp White
          marigold: '#E5E5E5', // Secondary Accent: Warm Silver
          teal: '#FFFFFF',     // Radar & Status: Pure White
        },
        nature: {
          emerald: '#FFFFFF',
          mint: '#E5E5E5',
          amber: '#D4D4D4',
          sand: '#FAFAFA',
          sky: '#A3A3A3',
        },
        text: {
          primary: '#FFFFFF',  // Crisp Pure White
          muted: '#888888',    // Sleek Platinum Gray
        },
        obsidian: {
          950: '#000000',
          900: '#0A0A0A',
          850: '#141414',
          800: '#222222',
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
        'glow-white': '0 0 25px rgba(255, 255, 255, 0.25)',
        'glow-white-lg': '0 0 45px rgba(255, 255, 255, 0.4)',
        'glow-silver': '0 0 20px rgba(220, 220, 220, 0.2)',
      },
      animation: {
        'pulse-white': 'pulseWhite 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseWhite: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
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
