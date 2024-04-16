'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
import LandingPromoComponent from '@/components/landing-promo'
import { appFont } from './fonts'
import { useRef, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.reset()
    router.push('/txt2img')
  }
  const divRef = useRef(null);

  useEffect(() => {
    const setHeight = () => {
      div.style.height = `${window.innerHeight}px`;
    };
    const div: any = divRef.current;
    if (div) {
      setHeight()
      window.addEventListener('resize', setHeight)
    }
    return () => window.removeEventListener('resize', setHeight)
  }, []);

  return (
    <div ref={divRef} className={`${styles.main} ${appFont.className} flex bg-gradient-to-b from-primary to-[#98CDB1] w-full h-full`} >
      <div className={styles.centerLanding}>
        <LandingPromoComponent />
        <Spacer y={20} />
        <Button size='md' className='w-full font-medium' color='primary' radius='sm' onPress={handleTxt2img}>Get Started</Button>
      </div >
    </div >

  )
}