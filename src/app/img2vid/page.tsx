'use client'
import { useEffect, useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { useSearchParams } from 'next/navigation'
import { Spacer, Image } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"


export default function Page() {
    const searchParams = useSearchParams()
    const gContext = useGenerationContext()

    const [imageUrl, setImageUrl] = useState<string>()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | null>(null)

    useEffect(() => {
        const output = gContext.t2iOutputs[gContext.t2iOutputSelectedIndex]
        if (output) {
            setImageUrl(output.mediaUrl)
        }
        console.log('?????? read coverImageFileUrl')
        console.log(gContext.coverImageDataURL)
    }, [gContext.coverImageDataURL])

    console.log('oooooopps read coverImageFileUrl')
    console.log(gContext.coverImageDataURL)

    const onVideoGenerated = async (outputs: Array<GenerationOutput>) => {
        if (outputs.length > 0) {
            setVideoOutput(outputs[0])
        }
    }
    return (
        <>
            {imageUrl && <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <h3>Step 2: Make it into a video</h3>
                    <Spacer y={4} />
                    {gContext.coverImageDataURL && <Image src={gContext.coverImageDataURL} />}
                    <Img2VidComponent
                        isAdvancedView={searchParams.get('view') === 'advanced'}
                        imageUrl={imageUrl}
                        onVideoGenerated={onVideoGenerated} />
                </div>
            </section>}
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