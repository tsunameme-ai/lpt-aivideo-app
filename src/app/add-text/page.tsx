'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import TextOverlay from "@/components/text-overlay"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import Link from "next/link"


export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverImageDataURL, setCoverImageDataURL] = useState<string | undefined>(gContext.coverImageDataURL)
    useEffect(() => {
        const output = gContext.t2iOutputs[gContext.t2iOutputSelectedIndex]
        if (output) {
            setImageUrl(output.mediaUrl)
        }
    }, [])

    const handleClickToVideo = () => {
        gContext.setCoverImageDataURL(coverImageDataURL)
        console.log('?????handleClickToVideo')
        console.log(coverImageDataURL)
        router.push('img2vid')
    }

    const onTextOverlayChange = (imgDataURL: string) => {
        setCoverImageDataURL(imgDataURL)
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                {imageUrl && <>
                    <TextOverlay
                        src={imageUrl}
                        onChange={onTextOverlayChange} />
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