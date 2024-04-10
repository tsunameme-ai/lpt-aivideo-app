'use client'
import dynamic from "next/dynamic";
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import { useGenerationContext } from "@/context/generation-context"
import { GenerationOutputItem } from "@/libs/types"
import styles from '@/styles/home.module.css'
import { Analytics } from "@/libs/analytics"
import { StartOutputEvent } from "@/components/editor/types";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)

    const handleClickToVideo = () => {
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
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div className='text-[20px]'>Step 2 of 3: Add your copy</div>
                    <Spacer y={2}></Spacer>
                    {t2iOutput ?
                        <Editor
                            onImagesRendered={onImagesRendered}
                            imageUrl={t2iOutput.url}
                        />
                        : <>
                        </>}
                </div>

                {t2iOutput &&
                    <>
                        <Spacer y={4} />
                        <div className={styles.promptControls}>
                            <div>
                                <Button
                                    className={styles.nextBtn}
                                    onPress={handleClickToVideo}
                                    size="md"
                                >
                                    <div className='text-[20px]'>GIF it</div>
                                </Button>
                            </div>
                            <Spacer y={4} />
                            <div>
                                <Button
                                    className={styles.backBtn}
                                    onClick={() => router.back()}
                                    size="md"
                                >
                                    <div className='text-[20px]'>Back</div>
                                </Button>
                            </div>
                        </div>
                    </>}
            </section >
        </>
    )
}