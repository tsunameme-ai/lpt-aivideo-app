'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
//import MediaPlayerComponent from "@/components/media-player"
import LandingPromoComponent from '@/components/landing-promo'
import { appFont } from './fonts'

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.reset()

    router.push('/txt2img')
  }

  return (
    <section className={`${styles.main} ${appFont.className}`}>

      <div className={styles.centerLanding}>
        <LandingPromoComponent />
        <Spacer y={20} />
        <Button size='md' className='w-full font-medium' color='primary' radius='sm' onPress={handleTxt2img}>Get Started</Button>
      </div >
    </section >

  )
}