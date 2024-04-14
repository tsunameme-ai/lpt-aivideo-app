import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import type { Viewport } from 'next'
import GenerationContextProvider from '@/context/generation-context'
import NavigationComponent from "@/components/navigation"
import { GoogleAnalytics } from '@next/third-parties/google'
import { appFont, inter } from './fonts'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Tsunameme',
  description: 'Tsunameme brings revolutions to meme'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={`comfort ${inter.className} ${appFont.className}`}>
      <body>
        <Providers>
          <GenerationContextProvider>
            <header className='py-1'>
              <NavigationComponent />
            </header>
            {children}
          </GenerationContextProvider>
        </Providers>
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GID!} />
    </html >
  )
}