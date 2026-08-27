/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature & Expedition Luxury Palette
        forest: {
          950: '#030806', // Pitch Forest Night
          900: '#06130E', // Deep Evergreen Canvas
          850: '#0B1E17', // Pine Glass Surface
          800: '#122C23', // Elevated Moss Hover
          700: '#1C4235', // Subtle Border
        },
        nature: {
          emerald: '#10B981', // Lush Rainforest Accent
          mint: '#34D399',    // Vibrant Fern
          amber: '#F59E0B',   // Sunrise Gold / Campfire
          sand: '#E6DFD5',    // Himalayan Stone Off-white
          sky: '#0284C7',     // Glacial River
        },
        base: {
          bg: '#040B08',       // Deep Rainforest Night
          card: '#081711',     // Moss Glass Surface
          elevated: '#0E241B', // Elevated Hover Card
          border: '#153629',   // Organic Border
        },
        accent: {
          violet: '#10B981',   // Mapped to Lush Emerald for global buttons
          marigold: '#F59E0B', // Sunrise Amber
          teal: '#34D399',     // Live Radar Mint
        },
        text: {
          primary: '#F2EFE9',  // Warm Stone Off-white
          muted: '#8EA89D',    // Forest Mist Secondary
        },
        obsidian: {
          950: '#040B08',
          900: '#081711',
          850: '#0E241B',
          800: '#153629',
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
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.3)',
        'glow-emerald-lg': '0 0 50px rgba(16, 185, 129, 0.45)',
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.3)',
        'glow-forest': '0 10px 40px -10px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'pulse-emerald': 'pulseEmerald 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseEmerald: {
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
