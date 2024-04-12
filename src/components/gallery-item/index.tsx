'use client'
import { fetchGenerationData } from "@/actions/stable-diffusion"
import { useEffect, useState } from "react"
import { Image, Spinner, Button, Spacer } from '@nextui-org/react'
import { GenerationRequest, GenerationType } from "@/libs/types"
import ErrorComponent from "../error"
import styles from "@/styles/home.module.css"
import { useRouter } from 'next/navigation'
import MediaPlayerComponent from "../media-player"

interface GalleryItemComponentProps {
    generationId: string
    positionId?: number
}

const GalleryItemComponent: React.FC<GalleryItemComponentProps> = (props: GalleryItemComponentProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [generation, setGeneration] = useState<GenerationRequest>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const router = useRouter()
    const requestData = async (gid: string) => {
        setIsLoading(true)
        try {
            const segs = gid.split(':')
            console.log(segs)
            const data = await fetchGenerationData(segs[0])
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
    /*
                    <p>Model Id: {generation.input.modelId}</p>
                    <p>{generation.input.width} x {generation.input.height}</p>

    */
    const HandleSeeMore = () => {
        router.push('/gallery')
    }
    const HandleCreate = () => {
        router.push('/')
    }

    return (
        <>
            {isLoading && <Spinner />}
            {generation && (generation?.outputs?.length ?? 0) > 0 &&
                <>
                    {generation.type === GenerationType.TXT2IMG && <>
                        <div className={styles.imagePreview}>
                            {generation.outputs!.map((item, index) => (
                                <Image className={styles.center} src={item.url} key={`${props.generationId}-${index}`} alt={item.seed.toString()} />
                            ))}
                        </div>
                    </>}
                    {generation.type === GenerationType.IMG2VID && <>
                        <div className={styles.videoPreview}>
                            {generation!.outputs!.map((item) => (
                                <MediaPlayerComponent src={item.url} className={styles.center} key={generation.id} />
                            ))}
                        </div>
                    </>}
                    <Spacer y={10} />
                    <div className={styles.centerSection}>
                        <Button size='lg' className='w-full' color='primary' radius='sm'
                            onPress={HandleSeeMore}>See More
                        </Button>
                        <Spacer y={10} />
                        <Button size='lg' className='w-full' color='primary' variant="ghost" radius='sm'
                            onPress={HandleCreate}>Be A Creator
                        </Button>
                    </div >
                </>}
            <ErrorComponent errorMessage={errorMessage} />
        </>
    )
}

export default GalleryItemComponent;