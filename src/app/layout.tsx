import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import type { Viewport } from 'next'
import GenerationContextProvider from '@/context/generation-context'
import NavigationComponent from "@/components/navigation"
import WarmUpIndicator from '@/components/warmup-indicator'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Tsunameme',
  description: 'Tsunameme brings revolutions to meme'
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
          <GenerationContextProvider>
            <header className='py-1'>
              <NavigationComponent />
              <WarmUpIndicator />
            </header>
            {children}
          </GenerationContextProvider>
        </Providers>
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GID!} />
    </html >
  )
}

/*
// Temporary comment out
          <footer className="w-full flex items-center justify-center py-3 bottom-0 absolute">
            <span className="text-blue-100">Powered by &nbsp;</span>
            <p className="text-red-300">Sleepy Dao</p>
          </footer>

*/
