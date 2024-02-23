'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import TextOverlay from "@/components/text-overlay"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import Link from "next/link"
import { LocalImageData } from "@/libs/types"

import styles from '@/styles/home.module.css'

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverImageData, setCoverImageData] = useState<LocalImageData | undefined>(gContext.coverImageData)
    const [coverText, setCoverText] = useState<string>(gContext.coverText)

    useEffect(() => {
        const output = gContext.t2iOutputs[gContext.t2iOutputSelectedIndex]
        if (output) {
            setImageUrl(output.mediaUrl)
        }
    }, [])

    const handleClickToVideo = () => {
        gContext.setCoverText(coverText)
        gContext.setCoverImageData(coverImageData)
        router.push('img2vid')
    }

    const onTextOverlayChange = (text: string, imgDataUrl: string, overlayImgDataUrl: string, width: number, height: number) => {
        setCoverText(text)
        setCoverImageData({
            remoteURL: imageUrl!,
            dataURL: imgDataUrl,
            overlayImageDataURL: overlayImgDataUrl,
            width,
            height
        })
    }

    const handleClickDownload = () => {
        if (coverImageData) {
            const link = document.createElement("a");
            link.href = coverImageData.dataURL;
            link.download = "image.png";
            link.click();
        }
    }


    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div>Step 2: Add your copy</div>
                    <Spacer y={2}></Spacer>
                    {imageUrl && <>
                        <div>
                            <TextOverlay
                                src={imageUrl}
                                text={coverText}
                                onImageData={onTextOverlayChange}
                                onDownloadClick={handleClickDownload} />
                        </div>
                        <Spacer y={2} />

                        <div className="promptControls">

                            <div className={styles.makeVideoBtn}>
                                <Button color='primary' onPress={handleClickToVideo}>Next</Button>
                            </div>
                            <div className={styles.backBtn}>
                                <Button color="primary" onClick={() => router.back()}>Back</Button>
                            </div>
                        </div>
                    </>}

                    {!imageUrl && <>
                        <ErrorComponent errorMessage="No image" />
                        <Link href={'/txt2img'}>Generate Image</Link>
                    </>}
                </div>
            </section>
        </>
    )
}