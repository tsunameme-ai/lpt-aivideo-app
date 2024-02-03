import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import type { Viewport } from 'next'
import { Link } from "@nextui-org/link"

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Sleepy Dao',
  description: 'Sleepy Dao is a cutting-edge platform that leverages the power of Livepeer and AI technology to seamlessly generate stunning images and videos, empowering users to bring their creative visions to life with ease and precision.'
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
    <html lang="en" className='comfort'>
      <body>
        <Providers>
          <header className='py-10'></header>
          {children}

          <footer className="w-full flex items-center justify-center py-3 bottom-0 absolute">
            <span className="text-blue-100">Powered by &nbsp;</span>
            <p className="text-red-300">Sleepy Dao</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
