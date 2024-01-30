'use client'
import { Card, CardBody } from "@nextui-org/react"
import { useState } from "react"
import { GenerationOutput } from "@/api/types"
import Img2VidComponent from "@/components/img2vid"
import GenerationStatusComponent from "@/components/generation-status"

export default function Page({ params }: { params: { vid: string, asset: string } }) {
    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | null>(null)
    const previewRender = (): any => {
        if (generationOutput?.status === 'success') {
            const segs = generationOutput.mediaUrl.split('.')
            const surfix = segs[segs.length - 1].toLowerCase()
            const isVideo = ['mp4'].includes(surfix)
            return isVideo ?
                <video width={520} loop controls autoPlay src={generationOutput?.mediaUrl} />
                : <Img2VidComponent imageOutput={generationOutput!} />
        }
        return ''
    }
    return (
        <section>
            <Card>
                <CardBody>
                    <GenerationStatusComponent
                        onOutputFetched={setGenerationOutput}
                        assetType={params.asset}
                        generationId={params.vid} />
                    {previewRender()}
                </CardBody>
            </Card>

        </section >
    )
}