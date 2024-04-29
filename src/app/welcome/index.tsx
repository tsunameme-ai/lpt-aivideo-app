'use client'
import { Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
import LandingPromoComponent from '@/components/landing-promo'
import { PrimaryButton } from '@/components/buttons'
import { appFont } from '@/app/fonts'

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const handleTxt2img = () => {
        //Clear context 
        gContext.reset()
        router.push('/txt2img')
    }

    return (
        <div className={`${styles.main} ${appFont.className} w-full min-h-svh bg-gradient-to-b from-50% from-primary to-[#98CDB1]`}>
            <div className={`h-32 w-full flex bg-img bg-repeat-x ${styles.wave}`} />
            <div className={styles.centerLanding}>
                <div className='font-bold text-background text-5xl'>TSUNAMEME</div>
                <div className='font-semibold text-background text-base'>
                    <p>Making GIF expressions</p>
                    <p>with generative AI</p>
                </div>
                <Spacer y={4} />
                <LandingPromoComponent />
                <Spacer y={8} />
                <PrimaryButton onPress={handleTxt2img}>Get Started</PrimaryButton>
            </div >
        </div>
    )
}