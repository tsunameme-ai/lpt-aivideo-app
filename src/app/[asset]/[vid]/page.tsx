'use client'
import { Button, Card, CardBody, Spacer, Image } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { API } from '@/api/api'
import { VideoGenerationOutput } from "@/api/types"

export default function Page({ params }: { params: { vid: string, asset: string } }) {
    const [vidOutput, setVidOutput] = useState<VideoGenerationOutput | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    useEffect(() => {
        fetchAsset()
            .catch(console.error)
    }, [])


    const fetchAsset = async () => {
        setIsFetching(true)
        setErrorMessage('')

        try {
            const vid = await API.fetchAsset(params.vid)
            setVidOutput(vid)
            setErrorMessage('')
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsFetching(false)
        }
    }
    const handleFetchClick = async (e: any) => {
        fetchAsset()
    }
    const isVideo = (link: string) => {
        const segs = link.split('.')
        const surfix = segs[segs.length - 1].toLowerCase()
        return ['mp4'].includes(surfix)
    }

    const isVideoReady = () => {
        if (vidOutput?.status === 'success') {
            return isVideo(vidOutput.mediaUrl)
        }
        return false
    }
    const isImageReady = () => {
        if (vidOutput?.status === 'success') {
            return !isVideo(vidOutput.mediaUrl)
        }
        return false
    }

    return (
        <section>
            <Card>
                <CardBody>
                    <div hidden={vidOutput?.status === 'success'}>
                        <Spacer y={4} />
                        <p>Your {params.asset} is being processed.</p>
                        <Spacer y={4} />
                        <Button
                            hidden={true}
                            color="primary"
                            isLoading={isFetching}
                            onPress={handleFetchClick}>
                            Check {params.asset} status again
                        </Button>
                        <Spacer y={4} />
                    </div>

                    <div hidden={errorMessage.length == 0}>
                        <Spacer y={1} />
                        <p className='text-tiny text-danger'>{errorMessage}</p>
                        <Spacer y={4} />
                    </div>
                    <Image hidden={!isImageReady()} width={520} src={vidOutput?.mediaUrl} />
                    <video hidden={!isVideoReady()} width={520} loop controls autoPlay src={vidOutput?.mediaUrl} />
                </CardBody>
            </Card>

        </section >
    )
}