import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import Features from './components/Features'
import Workflow from './components/Workflow'
import CtaSection from './components/CtaSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/10">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#f5f7fa]">
          IO
        </span>
        <a
          href="/index.html"
          className="label px-4 py-2 glass rounded border border-[#3b7dd8]/40 text-[#3b7dd8] hover:border-[#3b7dd8]/80 hover:text-[#60a5fa] transition-all duration-300"
        >
          Launch Explorer
        </a>
      </nav>

      <Hero />
      <TrustStrip />
      <Features />
      <Workflow />
      <CtaSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="label">IO Explorer — 3D Space Visualization</span>
          <span className="label">WebGL · Three.js · Real-Time Rendering</span>
        </div>
      </footer>
    </main>
  )
}
