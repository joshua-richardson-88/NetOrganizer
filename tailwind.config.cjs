/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const ProjectUtilities = plugin(({ addUtilities }) => {
  addUtilities({
    '.flip-horizontal': {
      transform: 'rotateY(180deg)',
    },
    '.flip-vertical': {
      transform: 'rotateX(180deg)',
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d',
    },
    '.perspective': {
      perspective: '1000px',
    },
    '.backface-hidden': {
      backfaceVisibility: 'hidden',
    },
  })
})

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        card: '1fr 36px',
      },
    },
  },
  plugins: [ProjectUtilities],
}
