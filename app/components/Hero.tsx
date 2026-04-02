'use client'

import { motion } from 'framer-motion'

function OrbitalSVG() {
  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className="relative flex items-center justify-center"
    >
      <svg
        width="380"
        height="380"
        viewBox="0 0 380 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer ring — slow rotation */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '50%', originY: '50%', transformOrigin: '190px 190px' }}
        >
          <ellipse
            cx="190"
            cy="190"
            rx="170"
            ry="52"
            stroke="rgba(59,125,216,0.25)"
            strokeWidth="1"
          />
          {/* Planet on outer orbit */}
          <circle cx="360" cy="190" r="5" fill="#3b7dd8" opacity="0.9" />
        </motion.g>

        {/* Middle ring — opposite direction */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '50%', originY: '50%', transformOrigin: '190px 190px' }}
        >
          <ellipse
            cx="190"
            cy="190"
            rx="120"
            ry="38"
            stroke="rgba(59,125,216,0.18)"
            strokeWidth="1"
          />
          {/* Planet on middle orbit */}
          <circle cx="310" cy="190" r="4" fill="#60a5fa" opacity="0.85" />
        </motion.g>

        {/* Inner ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '50%', originY: '50%', transformOrigin: '190px 190px' }}
        >
          <ellipse
            cx="190"
            cy="190"
            rx="72"
            ry="24"
            stroke="rgba(59,125,216,0.22)"
            strokeWidth="1"
          />
          {/* Inner planet */}
          <circle cx="262" cy="190" r="3" fill="#93c5fd" opacity="0.8" />
        </motion.g>

        {/* Saturn ring hint */}
        <ellipse
          cx="360"
          cy="190"
          rx="8"
          ry="3"
          stroke="rgba(59,125,216,0.5)"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Central sun — pulsing glow */}
        <motion.circle
          cx="190"
          cy="190"
          r="14"
          fill="rgba(255,220,100,0.9)"
          animate={{ opacity: [0.85, 1, 0.85], r: [13, 15, 13] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="190"
          cy="190"
          r="22"
          fill="transparent"
          stroke="rgba(255,200,60,0.2)"
          strokeWidth="4"
          animate={{ opacity: [0.3, 0.6, 0.3], r: [20, 26, 20] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="190"
          cy="190"
          r="32"
          fill="transparent"
          stroke="rgba(255,180,40,0.08)"
          strokeWidth="6"
          animate={{ opacity: [0.2, 0.45, 0.2], r: [28, 36, 28] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />

        {/* Decorative asteroid dots */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const rx = 148
          const ry = 46
          const x = 190 + rx * Math.cos(rad)
          const y = 190 + ry * Math.sin(rad)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={0.8}
              fill="rgba(255,255,255,0.35)"
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #050814 0%, #000000 100%)' }}
    >
      {/* Star field */}
      <div className="star-field" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="label mb-6 px-4 py-2 glass rounded-full border border-white/10"
        >
          IO Explorer&nbsp;&nbsp;/&nbsp;&nbsp;Real-Time Visualization
        </motion.div>

        {/* Orbital SVG centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-10"
        >
          <OrbitalSVG />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#f2f5f7] mb-5 leading-tight"
        >
          Explore the Universe{' '}
          <span className="text-[#3b7dd8]">in Real-Time</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="text-sm sm:text-base text-[#f5f7fa]/55 max-w-2xl leading-relaxed mb-10"
        >
          Traverse the Milky Way. Inspect planetary orbits. Navigate 5,000-object
          asteroid fields — all rendered live in your browser.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="/index.html"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-3 glass rounded border border-[#3b7dd8]/50 text-[#3b7dd8] text-sm tracking-[0.1em] uppercase hover:border-[#3b7dd8]/90 hover:text-[#60a5fa] transition-colors duration-300"
        >
          Launch Explorer
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #000)' }} />
    </section>
  )
}
