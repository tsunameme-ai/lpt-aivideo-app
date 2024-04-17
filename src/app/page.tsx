'use client'
import { Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
import LandingPromoComponent from '@/components/landing-promo'

export default function Home() {
  const router = useRouter()
  const gContext = useGenerationContext()
  const handleTxt2img = () => {
    //Clear context 
    gContext.reset()
    router.push('/txt2img')
  }

  return (
    <div className={`${styles.main} w-full f-full min-h-screen bg-gradient-to-b from-50% from-primary to-[#98CDB1]`} style={{ border: '1px solid #0f0' }}>
      <div className="h-32 w-full flex bg-img bg-repeat-x" style={{ backgroundImage: "url('/wave.png')" }} />
      <div className={styles.centerLanding}>
        <Spacer y={8} />
        <LandingPromoComponent />
        <Spacer y={10} />
        <Button size='md' className='w-full font-medium' color='primary' radius='sm' onPress={handleTxt2img}>Get Started</Button>
      </div >
    </div>
  )
}