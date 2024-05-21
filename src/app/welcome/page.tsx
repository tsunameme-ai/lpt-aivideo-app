'use client'
import { Spacer } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/home.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useGenerationContext } from '@/context/generation-context'
import LandingPromoComponent from '@/components/landing-promo'
import { PrimaryButton, SecondaryButton } from '@/components/buttons'
import { appFont } from '@/app/fonts'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [installPrompt, setInstallPrompt] = useState<boolean>(false)
    const handleTxt2img = () => {
        //Clear context 
        gContext.reset()
        router.push('/txt2img')
    }
    const handleDownload = () => {
        window.dispatchEvent(new Event('requestToInstall'))
    }

    useEffect(() => {
        setInstallPrompt(localStorage.getItem('installPrompt') == 'true' ? true : false)
        console.log(installPrompt)
    }, [localStorage.getItem('installPrompt')])

    return (
        <div className={`${styles.main} ${appFont.className} w-full min-h-svh bg-gradient-to-b from-50% from-primary to-[#98CDB1]`}>
            <div className={`${styles.wave}`} />
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
                <Spacer y={2} />
                {
                    installPrompt && <>
                        <SecondaryButton onPress={handleDownload} className={styles.installBtn} > Install the desktop app</SecondaryButton>
                    </>
                }
            </div >
        </div >
    )
}