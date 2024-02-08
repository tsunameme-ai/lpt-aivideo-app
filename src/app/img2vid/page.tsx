'use client'
import { useEffect, useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import { useSearchParams } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
import styles from "@/styles/home.module.css"


export default function Page() {
    const searchParams = useSearchParams()

    const [imageUrl, setImageUrl] = useState<string>()
    const [videoOutput, setVideoOutput] = useState<GenerationOutput | null>(null)

    useEffect(() => {
        const imgurl = searchParams.get('imgurl')
        if (imgurl) {
            setImageUrl(imgurl)
        }
    }, [])


    const onVideoGenerated = async (output: GenerationOutput) => {
        if (output) {
            setVideoOutput(output)
        }
    }
    return (
        <>
            {imageUrl && <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <h3>Step 2: Make it into a video</h3>
                    <Spacer y={4} />
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