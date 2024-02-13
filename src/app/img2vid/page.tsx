'use client'
import { useEffect, useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { useSearchParams } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import ImageWithTextOverlay from "@/components/image-text-overlay"
import React from "react"


export default function Page() {
    const searchParams = useSearchParams()

    const [imageUrl, setImageUrl] = useState<string>()
    const [coverText, setCoverText] = useState<string>()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | null>(null)

    useEffect(() => {
        const imgurl = searchParams.get('imgurl')
        if (imgurl) {
            setImageUrl(imgurl)
        }
        const cover = searchParams.get('cover')
        if (cover) {
            setCoverText(cover)
        }
    }, [])


    const onVideoGenerated = async (output: GenerationOutput) => {
        if (output) {
            setVideoOutput(output)
        }
    }
    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                {imageUrl && <div className={styles.centerSection}>
                    <div>Step 3: Turn it into a video</div>
                    <Spacer y={4} />
                    <ImageWithTextOverlay
                        imageUrl={imageUrl}
                        text={coverText || ''} />
                    <Img2VidComponent
                        isAdvancedView={searchParams.get('view') === 'advanced'}
                        imageUrl={imageUrl}
                        onVideoGenerated={onVideoGenerated} />
                </div>
                }
                {videoOutput && <>
                    <Spacer y={4} />
                    <div className="flex justify-center items-center" >
                        <video loop controls autoPlay src={videoOutput.mediaUrl} />
                    </div>
                    <Spacer y={4} />
                </>}
            </section>
        </>
    )
}