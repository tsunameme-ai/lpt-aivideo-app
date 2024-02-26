'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { DEFAULT_MOTION_BUCKET_ID, DEFAULT_NOISE_AUG_STRENGTH, DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutput, GenerationRequest, GenerationType, Img2vidNativeInput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { Spacer, Image, Link, Button } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import AdvancedIndicator from "@/components/advanced-indicator"
import ErrorComponent from "@/components/error"
import LongrunIndicator from "@/components/longrun-indicator"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | undefined>(undefined)
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [i2vInput, setI2vInput] = useState<Img2vidNativeInput>(gContext.i2vInput || {
        imageUrl: gContext.coverImageData?.remoteURL || '',
        width: DEFAULT_VIDEO_WIDTH,
        height: DEFAULT_VIDEO_HEIGHT,
        motionBucketId: DEFAULT_MOTION_BUCKET_ID,
        noiseAugStrength: DEFAULT_NOISE_AUG_STRENGTH
    })
    //const [errorMessage, setErrorMessage] = useState<string>('')

    const showAdvIndicator = process.env.NEXT_PUBLIC_ADV_IND === "on"
    const onVideoGenerated = async (outputs: Array<GenerationOutput>) => {
        if (outputs.length > 0) {
            setVideoOutput(outputs[0])
        }
        setIsGeneratingVideo(false)
    }

    const onError = (e: Error) => {
        //setErrorMessage(e.message)
        console.log(e.message)
        setIsGeneratingVideo(false)
    }

    const handleGenerateVideoClick = async () => {
        if (gContext.coverImageData) {
            try {
                setIsGeneratingVideo(true)
                gContext.setI2vInput(i2vInput)
                const input = {
                    ...i2vInput,
                    imageUrl: gContext.coverImageData.remoteURL,
                    overlayBase64: gContext.coverImageData.overlayImageDataURL
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
                console.log('video gen error')
                console.log(e)
                setIsGeneratingVideo(false)
            }

        }

    }
    const onI2VInputChange = (w: number, h: number, mbi: number, nas: number, seed: number | undefined) => {
        i2vInput.width = w
        i2vInput.height = h
        i2vInput.motionBucketId = mbi
        i2vInput.noiseAugStrength = nas
        i2vInput.seed = seed
        setI2vInput(i2vInput)
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div>Step 3: Turn it into a video {showAdvIndicator && <AdvancedIndicator />} </div>
                    <Spacer y={4} />
                    <div className={styles.containerRelative}>
                        {videoOutput && <>
                            <video className={styles.videoPreview} loop controls autoPlay src={videoOutput.mediaUrl} />
                        </>}

                        {gContext.coverImageData && <>
                            {!videoOutput && <Image className={styles.imagePreview} src={gContext.coverImageData.dataURL} alt={gContext.coverImageData.dataURL} />}
                            <Img2VidComponent
                                isAdvancedView={gContext.isAdvancedView}
                                width={i2vInput.width}
                                height={i2vInput.width}
                                motionBucketId={i2vInput.motionBucketId}
                                noiseAugStrength={i2vInput.noiseAugStrength}
                                seed={i2vInput.seed}
                                onI2VInputChange={onI2VInputChange} />
                        </>}

                        {!gContext.coverImageData && <>
                            <ErrorComponent errorMessage="No Image" />
                            <Link href='/txt2vid'>Generate Image</Link>
                        </>}

                        {img2VidRequest &&
                            <div className={styles.longrunIndicator}>
                                <LongrunIndicator request={img2VidRequest}
                                    onError={onError}
                                    onComplete={onVideoGenerated}
                                />
                            </div>
                        }

                    </div>
                </div>
                <div className={styles.promptControls}>
                    <div className='float-left'>
                        <Button
                            className={styles.backBtn}
                            onPress={() => router.back()}
                            size="lg"
                        >
                            Back
                        </Button>
                    </div>
                    <div className='float-right'>
                        <Button
                            size="lg"
                            className={styles.backBtn}
                            isLoading={isGeneratingVideo}
                            onPress={handleGenerateVideoClick}
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}