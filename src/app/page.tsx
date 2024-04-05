'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
//import MediaPlayerComponent from "@/components/media-player"
import LandingPromoComponent from '@/components/landing-promo'

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.setT2iInput(undefined)
    gContext.setT2iOutputs([])
    gContext.setT2iOutputSelectedIndex(0)
    gContext.setOverlayText('')
    gContext.setOverlayImageData(undefined)
    gContext.setI2vInput(undefined)

    router.push('/txt2img')
  }

  return (
    <section className={styles.main}>
      <div className={styles.centerLanding}>
        <LandingPromoComponent />
        <Spacer y={20} />
        <Button size='lg' className={styles.startBtn} onPress={handleTxt2img}><div className='text-[20px]'>Get Started</div></Button>
      </div >
    </section >

  )
}