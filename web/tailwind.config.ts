// web/tailwind.config.ts

import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // NEW: A sophisticated color palette
      colors: {
        background: '#111111', // A very dark gray, softer than pure black
        foreground: '#EDEDED', // A soft off-white for primary text
        secondary: '#A0A0A0',  // Muted gray for secondary text
        accent: '#FFFFFF',      // Pure white for highlights and accents
        border: 'rgba(255, 255, 255, 0.1)', // Subtle, transparent border
      }
    },
  },
  plugins: [typography],
}
export default config

