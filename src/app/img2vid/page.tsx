'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { GenerationOutput, GenerationRequest } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { Spacer, Image, Link, Button } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import AdvancedIndicator from "@/components/advanced-indicator"
import ErrorComponent from "@/components/error"
import { LivepeerAPI } from "@/libs/external/livepeer";
import LongrunIndicator from "@/components/longrun-indicator"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | undefined>(undefined)
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
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
                const generationRequest = await new LivepeerAPI().generateVideo(
                    gContext.coverImageData.remoteURL, gContext.videoWidth,
                    gContext.videoHeight, 1, 0.05, 2233)

                if (generationRequest)
                    setImg2VidRequest(generationRequest)

            } catch (e) {
                console.log('video gen error')
                console.log(e)
                setIsGeneratingVideo(false)
            }

        }

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
                                width={gContext.videoWidth}
                                height={gContext.videoHeight}
                                imageUrl={gContext.coverImageData.remoteURL}
                                onVideoGenerated={onVideoGenerated}
                                isGeneratingVideo={isGeneratingVideo}
                                img2VidRequest={img2VidRequest}
                            />
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