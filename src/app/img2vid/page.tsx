'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { DEFAULT_MOTION_BUCKET_ID, DEFAULT_NOISE_AUG_STRENGTH, DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem, GenerationRequest, GenerationType, Img2vidInput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { Spacer, Image, Link, Button } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import AdvancedIndicator from "@/components/advanced-indicator"
import ErrorComponent from "@/components/error"
import LongrunIndicator from "@/components/longrun-indicator"
import { FaShare } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [videoOutput, setVideoOutput] = useState<GenerationOutputItem | undefined>(undefined)
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [isButtonNew, setIsButtonNew] = useState<boolean>(false)
    const [i2vInput, setI2vInput] = useState<Img2vidInput>(gContext.i2vInput || {
        imageUrl: gContext.overlayImageData?.remoteURL || '',
        width: gContext.overlayImageData?.width || DEFAULT_VIDEO_WIDTH,
        height: gContext.overlayImageData?.height || DEFAULT_VIDEO_HEIGHT,
        motionBucketId: DEFAULT_MOTION_BUCKET_ID,
        noiseAugStrength: DEFAULT_NOISE_AUG_STRENGTH,
        modelId: gContext.config.videoModels.find(item => { return item.default === true })?.value!
    })
    const [errorMessage, setErrorMessage] = useState<string>()

    const showAdvIndicator = process.env.NEXT_PUBLIC_ADV_IND === "on"
    const toastId = "copy-success"
    const onVideoGenerated = async (outputs: Array<GenerationOutputItem>) => {
        if (outputs.length > 0) {
            setVideoOutput(outputs[0])
        }
        setIsGeneratingVideo(false)
        setIsButtonNew(true)
    }

    const onError = (e: Error) => {
        //setErrorMessage(e.message)
        console.log(e.message)
        setIsGeneratingVideo(false)
        setIsButtonNew(false)
    }

    const handleShare = (e: any) => {
        navigator.clipboard.writeText(window.location.origin + '/gallery/' + videoOutput?.id)
        toast.success("Link is copied. Send it!", {
            toastId: toastId,
            autoClose: 1800,
            hideProgressBar: true
        })

        console.log(e.message)
    }

    const handleGenerateVideoClick = async () => {

        if (isButtonNew) {
            console.log('isButtonNew')
            return
        }

        if ((i2vInput.width % 8 != 0) || (i2vInput.height % 8 != 0)) {
            setErrorMessage('Width and height must be divisible by 8')
            return
        }
        setErrorMessage('')
        if (gContext.overlayImageData) {
            try {
                setIsGeneratingVideo(true)
                gContext.setI2vInput(i2vInput)
                const input: Img2vidInput = {
                    ...i2vInput,
                    imageUrl: gContext.overlayImageData.remoteURL,
                    overlayBase64: gContext.overlayImageData.overlayImageDataURL,
                    overlayText: gContext.overlayText,
                    imageGenerationId: gContext.t2iSelectedOutput!.id
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
                setIsButtonNew(false)
            }

            //href={`/gallery/${videoOutput.id}`}
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

    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div>Step 3: Make it a GIF {showAdvIndicator && <AdvancedIndicator />} </div>
                    <Spacer y={4} />
                    <div className={styles.containerRelative}>

                        {videoOutput && <>
                            <video className={styles.videoPreview} loop controls autoPlay src={videoOutput.url} />
                            <FaShare className={styles.shareIcon} onClick={handleShare} />
                        </>}
                        <ToastContainer />
                        {gContext.overlayImageData && <>
                            {!videoOutput && <Image className={styles.imagePreview} src={gContext.overlayImageData.dataURL} alt={gContext.overlayImageData.dataURL} />}
                            {<Img2VidComponent
                                isAdvancedView={gContext.isAdvancedView}
                                sdConfig={gContext.config}
                                width={i2vInput.width}
                                height={i2vInput.height}
                                modelId={i2vInput.modelId}
                                motionBucketId={i2vInput.motionBucketId}
                                noiseAugStrength={i2vInput.noiseAugStrength}
                                seed={i2vInput.seed}
                                onI2VInputChange={onI2VInputChange} />}
                        </>}
                        {errorMessage && <ErrorComponent errorMessage={errorMessage} />}

                        {!gContext.overlayImageData && <>
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
                    <div>
                        <Button
                            className={styles.nextBtn}
                            size="md"
                            isLoading={isGeneratingVideo}
                            onPress={handleGenerateVideoClick}
                        >
                            <h5>{isButtonNew ? 'Create New' : 'Render'}</h5>
                        </Button>
                    </div>
                    <Spacer y={4} />
                    <div>
                        <Button
                            className={styles.backBtn}
                            onPress={() => router.back()}
                            size="md"
                            isLoading={isGeneratingVideo}
                        >
                            <h5>Back</h5>
                        </Button>
                    </div>

                </div>
            </section>
        </>
    )
}