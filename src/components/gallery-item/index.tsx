'use client'
import { fetchGenerationData } from "@/actions/stable-diffusion";
import { useEffect, useState } from "react";
import { Image, Spinner } from '@nextui-org/react'
import { GenerationRequest, GenerationType } from "@/libs/types"
import ErrorComponent from "../error";

interface GalleryItemComponentProps {
    generationId: string
    positionId?: number
}

const GalleryItemComponent: React.FC<GalleryItemComponentProps> = (props: GalleryItemComponentProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [generation, setGeneration] = useState<GenerationRequest>()
    const [errorMessage, setErrorMessage] = useState<string>('')

    const requestData = async (gid: string) => {
        setIsLoading(true)
        try {
            const data = await fetchGenerationData(gid)
            setGeneration(data)
            setErrorMessage('')
        }
        catch (e: any) {
            setErrorMessage(e.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        requestData(props.generationId)
    }, [])
    return (
        <>
            {isLoading && <Spinner />}
            {generation && (generation?.outputs?.length ?? 0) > 0 && <>
                {generation.type === GenerationType.TXT2IMG && <>
                    <p>Image</p>
                    <p>Model Id: {generation.input.modelId}</p>
                    <p>{generation.input.width} x {generation.input.height}</p>
                    {generation.outputs!.map((item, index) => (
                        <Image src={item.url} key={`${props.generationId}-${index}`} alt={item.seed.toString()} />
                    ))}
                </>}
                {generation.type === GenerationType.IMG2VID && <>
                    <p>Image</p>
                    <p>Model Id: {generation.input.modelId}</p>
                    <p>{generation.input.width} x {generation.input.height}</p>
                    {generation!.outputs!.map((item, index) => (
                        <video src={item.url} key={`${props.generationId}-${index}`} />
                    ))}
                </>}
            </>}
            <ErrorComponent errorMessage={errorMessage} />
        </>
    )
}

export default GalleryItemComponent;