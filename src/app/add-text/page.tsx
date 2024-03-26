'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import TextOverlay from "@/components/text-overlay"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import Link from "next/link"
import { GenerationOutputItem, LocalImageData } from "@/libs/types"

import styles from '@/styles/home.module.css'
import { Analytics } from "@/libs/analytics"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)
    const [overlayImageData, setOverlayImageData] = useState<LocalImageData | undefined>(gContext.overlayImageData)
    const [overlayText, setOverlayText] = useState<string>(gContext.overlayText)

    const handleClickToVideo = () => {
        Analytics.trackEvent({ 'event': 'click-img2vid' })
        gContext.setOverlayText(overlayText)
        gContext.setOverlayImageData(overlayImageData)
        router.push('/img2vid')
    }

    const onTextOverlayChange = (text: string, localImage: LocalImageData) => {
        setOverlayText(text)
        setOverlayImageData(localImage)
    }

    const handleClickDownload = () => {
        if (overlayImageData) {
            const link = document.createElement("a");
            link.href = overlayImageData.dataURL!;
            link.download = "image.png";
            link.click();
        }
    }


    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div>Step 2: Add your copy</div>
                    <Spacer y={2}></Spacer>
                    {t2iOutput && <>
                        <div>
                            <TextOverlay
                                src={t2iOutput.url}
                                text={overlayText}
                                onImageData={onTextOverlayChange}
                                onDownloadClick={handleClickDownload} />
                        </div>
                    </>}

                    {!t2iOutput && <>
                        <ErrorComponent errorMessage="No image" />
                        <Link href={'/txt2img'}>Generate Image</Link>
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
                                    <h5>GIF it</h5>
                                </Button>
                            </div>
                            <Spacer y={4} />
                            <div>
                                <Button
                                    className={styles.backBtn}
                                    onClick={() => router.back()}
                                    size="md"
                                >
                                    <h5>Back</h5>
                                </Button>
                            </div>
                        </div>
                    </>}
            </section>
        </>
    )
}