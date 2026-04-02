import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IO Explorer — Real-Time 3D Space Visualization',
  description:
    'Traverse the Milky Way. Inspect planetary orbits. Navigate 5,000-object asteroid fields — all rendered live in your browser.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono bg-black text-near-white antialiased">{children}</body>
    </html>
  )
}
