'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DEFAULT_MOTION_BUCKET_ID, DEFAULT_NOISE_AUG_STRENGTH, DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem, GenerationRequest, GenerationType, Img2vidInput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { Spacer, Image, Link } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import LongrunIndicator from "@/components/longrun-indicator"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Analytics } from "@/libs/analytics"
import { usePrivy } from "@privy-io/react-auth";
import { appFont } from "../fonts"
import { PrimaryButton } from "@/components/buttons"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const { authenticated, user } = usePrivy()
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [i2vInput, setI2vInput] = useState<Img2vidInput>(gContext.i2vInput || {
        imageUrl: gContext.overlayImageData?.remoteURL || '',
        width: gContext.overlayImageData?.width || DEFAULT_VIDEO_WIDTH,
        height: gContext.overlayImageData?.height || DEFAULT_VIDEO_HEIGHT,
        motionBucketId: DEFAULT_MOTION_BUCKET_ID,
        noiseAugStrength: DEFAULT_NOISE_AUG_STRENGTH,
        modelId: gContext.config.videoModels.find(item => { return item.default === true })?.value!
    })

    const onVideoGenerated = async (outputs: Array<GenerationOutputItem>) => {
        Analytics.trackEvent({ 'event': 'vidgen-complete' })
        if (outputs.length > 0) {
            gContext.setI2vOutputs(outputs)
            router.replace(`/img2vid/${outputs[0].id}`)
        }
        setIsGeneratingVideo(false)
    }

    const onError = () => {
        setIsGeneratingVideo(false)
    }


    const handleGenerateVideoClick = async () => {
        if ((i2vInput.width % 8 != 0) || (i2vInput.height % 8 != 0)) {
            toast.error(`Width and height must be divisible by 8`, {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })
            return
        }
        if (!gContext.overlayImageData) {
            toast.error(`Input image is not found.`, {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })
        }

        try {
            setIsGeneratingVideo(true)
            gContext.setI2vInput(i2vInput)
            const input: Img2vidInput = {
                ...i2vInput,
                imageUrl: gContext.overlayImageData!.remoteURL,
                overlayBase64: gContext.overlayImageData!.overlayImageDataURL,
                overlayText: gContext.overlayText,
                imageGenerationId: gContext.t2iSelectedOutput!.id,
                userId: authenticated && user ? user.id : undefined,
                salt: gContext.userSalt
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify({
                    type: GenerationType.IMG2VID, input: input
                }),
            })

            const generationRequest = await response.json()
            if (generationRequest) {
                setImg2VidRequest(generationRequest)
            }

        } catch (e) {
            setIsGeneratingVideo(false)
        }
    }
    const onI2VInputChange = (w: number, h: number, mbi: number, nas: number, seed: number | undefined, model: string) => {
        i2vInput.width = w
        i2vInput.height = h
        i2vInput.motionBucketId = mbi
        i2vInput.noiseAugStrength = nas
        i2vInput.seed = seed
        i2vInput.modelId = model
        setI2vInput(i2vInput)
    }

    useEffect(() => {
        if (!gContext.isAdvancedView) {
            handleGenerateVideoClick()
        }
    }, [])

    return (
        <>
            <ToastContainer />
            <section className={`${styles.main} ${appFont.className}`}>
                {gContext.isReady && <div className={styles.centerSection}>
                    <div className='font-medium'>Step 3 of 3: Make it a GIF </div>
                    <Spacer y={4} />
                    <div>
                        {gContext.overlayImageData && <>
                            <Image className={styles.imagePreview} src={gContext.overlayImageData.dataURL} alt={gContext.overlayImageData.dataURL} />
                            {gContext.isAdvancedView && <Img2VidComponent
                                sdConfig={gContext.config}
                                width={i2vInput.width}
                                height={i2vInput.height}
                                modelId={i2vInput.modelId}
                                motionBucketId={i2vInput.motionBucketId}
                                noiseAugStrength={i2vInput.noiseAugStrength}
                                seed={i2vInput.seed}
                                onI2VInputChange={onI2VInputChange} />}
                        </>}

                        {!gContext.overlayImageData && <>
                            <ErrorComponent errorMessage="No Image" />
                            <Link href='/'>Start Over</Link>
                        </>}

                        {img2VidRequest &&
                            <div className={styles.longrunIndicator}>
                                <Spacer y={4} />
                                <LongrunIndicator request={img2VidRequest}
                                    onError={onError}
                                    onComplete={onVideoGenerated}
                                />
                            </div>
                        }
                    </div>
                    <Spacer y={4} />
                    <PrimaryButton
                        isLoading={isGeneratingVideo}
                        onPress={handleGenerateVideoClick}>Render
                    </PrimaryButton>
                    <Spacer y={4} />
                </div>}
            </section>
        </>
    )
}