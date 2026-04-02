'use client'

import { motion } from 'framer-motion'

function SmallOrbital() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '110px 110px' }}
      >
        <ellipse cx="110" cy="110" rx="98" ry="30" stroke="rgba(59,125,216,0.18)" strokeWidth="1" />
        <circle cx="208" cy="110" r="3.5" fill="#3b7dd8" opacity="0.7" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '110px 110px' }}
      >
        <ellipse cx="110" cy="110" rx="66" ry="20" stroke="rgba(59,125,216,0.14)" strokeWidth="1" />
        <circle cx="176" cy="110" r="2.5" fill="#60a5fa" opacity="0.6" />
      </motion.g>
      <motion.circle
        cx="110"
        cy="110"
        r="9"
        fill="rgba(255,220,100,0.85)"
        animate={{ opacity: [0.75, 1, 0.75], r: [8, 10, 8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="110"
        cy="110"
        r="16"
        fill="transparent"
        stroke="rgba(255,200,60,0.15)"
        strokeWidth="4"
        animate={{ opacity: [0.2, 0.5, 0.2], r: [14, 19, 14] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function CtaSection() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #050814 0%, #000 70%)' }}
    >
      {/* Background orbital */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <SmallOrbital />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="label mb-5">Ready to Explore</p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#f2f5f7] tracking-tight mb-5">
            The universe is live.
          </h2>

          <p className="text-sm text-[#f5f7fa]/50 leading-relaxed mb-10 max-w-md mx-auto">
            No installation. No accounts. Open the renderer and navigate.
          </p>

          <motion.a
            href="/index.html"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 glass rounded border border-[#3b7dd8]/50 text-[#3b7dd8] text-sm tracking-[0.1em] uppercase hover:border-[#3b7dd8]/90 hover:text-[#60a5fa] transition-all duration-300"
          >
            Launch IO Explorer
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
