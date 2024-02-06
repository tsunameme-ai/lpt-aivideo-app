'use client'
import { useState } from "react"
import { GenerationOutput } from "@/libs/types"
import Img2VidComponent from "@/components/img2vid"
import GenerationStatusComponent from "@/components/generation-status"
import { useRouter, useSearchParams } from 'next/navigation'
import { Spacer } from "@nextui-org/react"
//import styles from "../../styles/home.module.css"


export default function Page({ params }: { params: { vid: string, asset: string } }) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const vid = process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab' ? params.vid : searchParams.get('media')

    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | null>(null)

    const onVideo = async (output: GenerationOutput) => {
        if (process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab') {
            router.push(`/video/${output?.id}`)
        }
        else {
            router.push(`/video/${output?.id}?media=${output?.mediaUrl}`)
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
                    imageOutput={generationOutput!}
                    onVideo={onVideo} />
        }
        return ''
    }
    return (
        <>
            {vid && <section className='flex flex-col items-center justify-center'>
                <div>Step 2: Make it into a video</div>
                <Spacer y={4}></Spacer>
                <GenerationStatusComponent
                    onOutputFetched={setGenerationOutput}
                    assetType={params.asset}
                    generationId={vid!} />
                {previewRender()}
            </section>}

        </>
    )
}