'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import TextOverlay from "@/components/text-overlay"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import Link from "next/link"
import { LocalImageData } from "@/libs/types"


export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverImageData, setCoverImageData] = useState<LocalImageData | undefined>(gContext.coverImageData)
    useEffect(() => {
        const output = gContext.t2iOutputs[gContext.t2iOutputSelectedIndex]
        if (output) {
            setImageUrl(output.mediaUrl)
        }
    }, [])

    const handleClickToVideo = () => {
        gContext.setCoverImageData(coverImageData)
        router.push('img2vid')
    }

    const onTextOverlayChange = (imgDataUrl: string, width: number, height: number) => {
        setCoverImageData({
            remoteURL: imageUrl!,
            dataURL: imgDataUrl,
            width,
            height
        })
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                {imageUrl && <>
                    <TextOverlay
                        src={imageUrl}
                        onImageData={onTextOverlayChange} />
                    <Spacer y={4} />
                    <Button color='primary' onPress={handleClickToVideo}>Make a Video</Button>
                </>}
                {!imageUrl && <>
                    <ErrorComponent errorMessage="No image" />
                    <Link href={'/txt2img'}>Generate Image</Link>
                </>}
            </section>
        </>
    )
}