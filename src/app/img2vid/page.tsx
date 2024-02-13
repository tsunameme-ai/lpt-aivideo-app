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
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | null>(null)

    const onVideoGenerated = async (outputs: Array<GenerationOutput>) => {
        if (outputs.length > 0) {
            setVideoOutput(outputs[0])
        }
    }
    return (
        <>
            <AdvancedIndicator />
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <h3>Step 2: Make it into a video</h3>
                    <Spacer y={4} />
                    {gContext.coverImageData && <>
                        <Image src={gContext.coverImageData.dataURL} />
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
            </section>
            {videoOutput && <>
                <Spacer y={4} />
                <div className="flex justify-center items-center" >
                    <video loop controls autoPlay src={videoOutput.mediaUrl} />
                </div>
                <Spacer y={4} />
            </>}
        </>
    )
}