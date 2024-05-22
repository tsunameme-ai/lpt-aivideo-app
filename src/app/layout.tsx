import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import NavigationComponent from "@/components/navigation"
import { GoogleAnalytics } from '@next/third-parties/google'
import { appFont, inter } from './fonts'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Tsunameme',
  description: 'Tsunameme gives anyone the superpower to create impressive gifs with a couple lines of text.',
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
          <NavigationComponent />
          {children}
        </Providers>
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GID!} />
    </html >
  )
}