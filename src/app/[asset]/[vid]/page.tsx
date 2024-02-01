'use client'
import { Card, CardBody } from "@nextui-org/react"
import { useState } from "react"
import { GenerationOutput } from "@/api/types"
import Img2VidComponent from "@/components/img2vid"
import GenerationStatusComponent from "@/components/generation-status"
import { useRouter, useSearchParams } from 'next/navigation'

export default function Page({ params }: { params: { vid: string, asset: string } }) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const vid = process.env.NEXT_PUBLIC_API === 'modelslab' ? params.vid : searchParams.get('media')

    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | null>(null)

    const onVideo = async (output: GenerationOutput) => {
        if (process.env.NEXT_PUBLIC_API === 'modelslab') {
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
                <div className="items-center "><video width={520} loop controls autoPlay src={generationOutput?.mediaUrl} /></div>
                : <Img2VidComponent imageOutput={generationOutput!} onVideo={onVideo} />
        }
        return ''
    }
    return (
        <section>
            {vid && <Card>
                <CardBody>
                    <GenerationStatusComponent
                        onOutputFetched={setGenerationOutput}
                        assetType={params.asset}
                        generationId={vid!} />
                    {previewRender()}
                </CardBody>
            </Card>}

        </section >
    )
}