/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-ibm-plex-mono)', 'IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        accent: '#3b7dd8',
        surface: 'rgba(5,7,11,0.68)',
        'near-white': '#f5f7fa',
      },
      backgroundImage: {
        'space-radial': 'radial-gradient(ellipse at center, #050814 0%, #000000 100%)',
      },
    },
  },
  plugins: [],
}
