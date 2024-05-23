'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
import { useGenerationContext } from "@/context/generation-context"
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem } from "@/libs/types"
import styles from '@/styles/home.module.css'
import { Analytics } from "@/libs/analytics"
import { StartOutputEvent } from "@/components/editor/types";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { appFont } from "../fonts";
import { PrimaryButton, SecondaryButton } from "@/components/buttons";
import { uploadImage } from "@/actions";
import { share } from "@/libs/share-utils";


const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)
    const [renderRequestFrom, setRenderRequestFrom] = useState<'vidgen' | 'share' | ''>('')
    const [isPrepShare, setIsPrepShare] = useState<boolean>(false)
    const [imageShareUrl, setImageShareUrl] = useState<string | undefined>(undefined)

    const handleClickToVideo = () => {
        setRenderRequestFrom('vidgen')
        window.dispatchEvent(new Event(StartOutputEvent))
    }

    const handleShare = () => {
        setRenderRequestFrom('share')
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
        if (renderRequestFrom === 'vidgen') {
            generateVideo(imgDataUrl, coverDataUrl, width, height)
        }
        else if (renderRequestFrom === 'share') {
            shareImage(imgDataUrl)
        }
    }
    const generateVideo = (imgDataUrl: string, coverDataUrl: string, width: number, height: number) => {

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
    const shareImage = async (imgDataUrl: string) => {
        setImageShareUrl(undefined)
        try {
            setIsPrepShare(true)
            const { url } = await uploadImage(imgDataUrl)
            console.log(url)
            if (url) {
                setImageShareUrl(url)
            }
        }
        catch (e) {
            toast.error(`Failed to get image ready for sharing`, {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })
        }
        finally {
            setIsPrepShare(false)
        }
    }
    useEffect(() => {
        if (imageShareUrl) {
            share({
                url: imageShareUrl,
                toastTitle: "Image link is copied. Send it!"
            }, 'copy-success')
        }

    }, [imageShareUrl])

    return (
        <>
            <ToastContainer />
            {gContext.isReady && <section className={`${styles.main} ${appFont.className}`}>
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
                    <div className={styles.centerSection}>
                        <Spacer y={4} />
                        <SecondaryButton isLoading={isPrepShare} onPress={handleShare}>Share image</SecondaryButton>
                        <Spacer y={4} />
                        <PrimaryButton onPress={handleClickToVideo}>GIF it</PrimaryButton>
                        <Spacer y={4} />
                    </div>}
            </section >}
        </>
    )
}