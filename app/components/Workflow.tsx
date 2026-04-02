'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Initialize',
    description:
      'Open IO Explorer in any WebGL-capable browser. The galaxy loads in under 2 seconds.',
  },
  {
    num: '02',
    title: 'Navigate',
    description:
      'Use orbit controls to traverse from macro galaxy scale down to individual planetary orbits.',
  },
  {
    num: '03',
    title: 'Inspect',
    description:
      'Search celestial bodies by name. Toggle visibility layers. Study orbital mechanics in real time.',
  },
]

export default function Workflow() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="label mb-4">Workflow</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f2f5f7] tracking-tight">
            Three steps to deep space.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-[2.6rem] left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(59,125,216,0.3), transparent)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.14 }}
                className="relative glass rounded-lg p-8 border border-white/10 group"
              >
                {/* Large faded background number */}
                <span
                  className="absolute top-4 right-6 text-6xl font-bold pointer-events-none select-none"
                  style={{ color: 'rgba(59,125,216,0.06)', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {step.num}
                </span>

                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#3b7dd8]/30 mb-5 relative z-10">
                  <span className="text-xs text-[#3b7dd8] tracking-widest font-medium">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-sm font-medium tracking-[0.08em] uppercase text-[#f2f5f7] mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-[#f5f7fa]/50 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
