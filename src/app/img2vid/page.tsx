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
    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div>Step 3: Turn it into a video</div>
                    <Spacer y={4} />

                    {videoOutput && <>
                        <Spacer y={4} />
                        <div className="flex justify-center items-center" >
                            <video loop controls autoPlay src={videoOutput.mediaUrl} />
                        </div>
                        <Spacer y={4} />
                    </>}
                    {gContext.coverImageData && <>
                        {!videoOutput && <Image src={gContext.coverImageData.dataURL} />}
                        {showAdvIndicator && <AdvancedIndicator />}
                        <Img2VidComponent
                            isAdvancedView={gContext.isAdvancedView}
                            width={gContext.coverImageData.width}
                            height={gContext.coverImageData.height}
                            imageUrl={gContext.coverImageData.remoteURL}
                            textImageDataURL={gContext.coverImageData.textImageDataURL}
                            coverImageDataURL={gContext.coverImageData.dataURL}
                            onVideoGenerated={onVideoGenerated} />
                    </>}
                    {!gContext.coverImageData && <>
                        <ErrorComponent errorMessage="No Image" />
                        <Link href='/txt2vid'>Generate Image</Link>
                    </>}
                </div>
            </section>
        </>
    )
}