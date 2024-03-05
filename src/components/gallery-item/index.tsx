'use client'
import { fetchGenerationData } from "@/actions/stable-diffusion";
import { GenerationResponse } from "@/libs/types";
import { useEffect, useState } from "react";
import { Image } from '@nextui-org/react'

interface GalleryItemComponentProps {
    generationId: string
    positionId?: number
}

const GalleryItemComponent: React.FC<GalleryItemComponentProps> = (props: GalleryItemComponentProps) => {
    const [generationResponse, setGenerationResponse] = useState<GenerationResponse>()

    const requestData = async (gid: string) => {
        const data = await fetchGenerationData(gid)
        setGenerationResponse(data)
    }

    useEffect(() => {
        requestData(props.generationId)
    }, [])
    return (
        <>
            {(generationResponse?.outputs || []).length > 0 && <>
                {generationResponse!.outputs.map((item) => (
                    <Image src={item.url} alt={item.seed.toString()} />
                ))}
            </>}
        </>
    )
}

export default GalleryItemComponent;