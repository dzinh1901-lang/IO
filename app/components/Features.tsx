'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Galaxy Rendering',
    description: 'Full Milky Way macro view with particle-based star field rendering.',
  },
  {
    title: 'Solar System',
    description: 'Sun, Earth, Jupiter, and Saturn with accurate orbital radii and rotation speeds.',
  },
  {
    title: 'Asteroid Belt',
    description: '5,000 individually tracked asteroid objects with real-time collision-aware simulation.',
  },
  {
    title: 'Camera Navigation',
    description: 'Orbit, zoom, and pan through the scene with precision WebGL camera controls.',
  },
  {
    title: 'Celestial Search',
    description: 'Locate any tracked celestial body by name with instant camera focus.',
  },
  {
    title: 'Layer Controls',
    description: 'Toggle orbital rings, labels, and object visibility layers independently.',
  },
]

function AccentDot() {
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-[#3b7dd8] opacity-80 flex-shrink-0" />
  )
}

export default function Features() {
  return (
    <section className="py-24 px-6" style={{ background: 'radial-gradient(ellipse at top, #050814 0%, #000 60%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="label mb-4">Capabilities</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f2f5f7] tracking-tight">
            Precision rendering at every scale.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="group glass rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-3 mb-3">
                <AccentDot />
                <h3 className="text-sm font-medium tracking-[0.06em] uppercase text-[#f2f5f7]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-xs text-[#f5f7fa]/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
