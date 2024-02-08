'use client'
import { useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import GenerationStatusComponent from "@/components/generation-status"
import { useRouter, useSearchParams } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
import styles from "@/styles/home.module.css"


export default function Page({ params }: { params: { vid: string, asset: string } }) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const vid = searchParams.get('media')

    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | null>(null)

    const onVideoGenerated = async (output: GenerationOutput) => {
        if (output) {
            router.push(`/video/${output.id}?media=${output.mediaUrl}`)
        }
    }
    const previewRender = (): any => {
        if (generationOutput?.status === 'success') {
            const segs = generationOutput.mediaUrl.split('.')
            const surfix = segs[segs.length - 1].toLowerCase()
            const isVideo = ['mp4'].includes(surfix)
            return isVideo ?
                <div className="flex justify-center items-center"><video loop controls autoPlay src={generationOutput?.mediaUrl} /></div>
                : <Img2VidComponent
                    isAdvancedView={searchParams.get('view') === 'advanced'}
                    imageUrl={generationOutput.mediaUrl}
                    onVideoGenerated={onVideoGenerated} />
        }
        return ''
    }
    return (
        <>
            {vid && <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <h3>Step 2: Make it into a video</h3>
                    <Spacer y={4}></Spacer>
                    <GenerationStatusComponent
                        onOutputFetched={setGenerationOutput}
                        assetType={params.asset}
                        generationId={vid!} />
                    {previewRender()}
                </div>
            </section>}

        </>
    )
}