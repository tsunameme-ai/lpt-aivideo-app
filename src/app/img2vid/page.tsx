'use client'
import { useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { Spacer, Image, Link } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import AdvancedIndicator from "@/components/advanced-indicator"
import ErrorComponent from "@/components/error"



export default function Page() {
    const gContext = useGenerationContext()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | undefined>(undefined)
    const showAdvIndicator = process.env.NEXT_PUBLIC_ADV_IND === "on"
    const onVideoGenerated = async (outputs: Array<GenerationOutput>) => {
        if (outputs.length > 0) {
            setVideoOutput(outputs[0])
        }
    }

    //const Img2VidComponentRef = useRef()
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
                                width={gContext.coverImageData.width}
                                height={gContext.coverImageData.height}
                                imageUrl={gContext.coverImageData.remoteURL}
                                onVideoGenerated={onVideoGenerated} />
                        </>}

                        {!gContext.coverImageData && <>
                            <ErrorComponent errorMessage="No Image" />
                            <Link href='/txt2vid'>Generate Image</Link>
                        </>}
                    </div>
                </div>
            </section>
        </>
    )
}