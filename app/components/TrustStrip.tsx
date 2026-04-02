'use client'

import { motion } from 'framer-motion'

const metrics = [
  { label: 'Rendering', value: 'WebGL Accelerated' },
  { label: 'Asteroid Objects', value: '5,000' },
  { label: 'Orbital Mechanics', value: 'Real-Time' },
  { label: 'Dependencies', value: 'Zero' },
]

export default function TrustStrip() {
  return (
    <section className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8 }}
        className="glass border-y border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center gap-1 px-6 py-4 text-center"
              >
                <span className="label">{m.label}</span>
                <span className="text-sm font-medium tracking-wide text-[#f2f5f7]">
                  {m.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
