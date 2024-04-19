'use client'
import dynamic from "next/dynamic";
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
import { useGenerationContext } from "@/context/generation-context"
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem, Txt2imgInput } from "@/libs/types"
import styles from '@/styles/home.module.css'
import { Analytics } from "@/libs/analytics"
import { usePrivy } from '@privy-io/react-auth'
import { AuthPromo } from "@/components/auth-indicator";
import { StartOutputEvent } from "@/components/editor/types";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { appFont } from "../fonts";
import { PrimaryButton } from "@/components/buttons";


const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const { authenticated, user } = usePrivy()
    const router = useRouter()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)
    const [authPrompt, setAuthPrompt] = useState<boolean>(false)

    const handleClickToVideo = () => {
        if (!authenticated || !user) {
            setAuthPrompt(true)
            return
        }
        proceedToVideo()
    }
    const proceedToVideo = () => {
        window.dispatchEvent(new Event(StartOutputEvent))
    }
    const onImagesRendered = (imgDataUrl: string, coverDataUrl: string, width: number, height: number) => {
        if (!imgDataUrl) {
            toast.error('Image dataURL cannot be generated', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        if (!imgDataUrl) {
            toast.error('Cover image dataURL cannot be generated', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        if (!t2iOutput) {
            toast.error('No image', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        gContext.setOverlayImageData({
            remoteURL: t2iOutput?.url,
            dataURL: imgDataUrl,
            width: width,
            height: height,
            overlayImageDataURL: coverDataUrl
        })

        Analytics.trackEvent({ 'event': 'click-img2vid' })
        router.push('img2vid')
    }

    return (
        <>
            <ToastContainer />
            <section className={`${styles.main} ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div className='font-medium'>Step 2 of 3: Add your caption</div>
                    <Spacer y={2} />
                    {t2iOutput &&
                        <Editor
                            width={DEFAULT_VIDEO_WIDTH}
                            height={DEFAULT_VIDEO_HEIGHT}
                            onImagesRendered={onImagesRendered}
                            imageUrl={t2iOutput.url}
                        />}
                </div>

                {t2iOutput &&
                    <>
                        <Spacer y={4} />
                        <div className={styles.centerSection}>
                            <PrimaryButton onPress={handleClickToVideo}>GIF it</PrimaryButton>
                        </div>
                    </>}
                {authPrompt && <AuthPromo onContinueWOLogin={proceedToVideo} onLoginComplete={proceedToVideo} />}
            </section >
        </>
    )
}