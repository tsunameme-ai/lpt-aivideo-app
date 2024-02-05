import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import type { Viewport } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'AI Creations Studio',
  description: 'AI Creations Studio is a cutting-edge platform that leverages the power of Livepeer and AI technology to seamlessly generate stunning images and videos, empowering users to bring their creative visions to life with ease and precision.'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
