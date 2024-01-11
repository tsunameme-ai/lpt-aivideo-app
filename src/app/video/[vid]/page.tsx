'use client'
import { Button, Card, CardBody, Spacer } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { API } from '@/api/api'
import { Txt2vidOutput } from "@/api/types"

export default function Page({ params }: { params: { vid: string } }) {
    const [vidOutput, setVidOutput] = useState<Txt2vidOutput | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    useEffect(() => {
        fetchVideo()
            .catch(console.error);
    }, [])


    const fetchVideo = async () => {
        setIsFetching(true)
        const vid = await API.fetchVideo(params.vid)
        setVidOutput(vid)
        setIsFetching(false)
    }
    const handleFetchClick = async (e: any) => {
        fetchVideo()
    }

    return (
        <section>
            <Card>
                <CardBody>
                    <div hidden={vidOutput?.status === 'success'}>
                        <Spacer y={4} />
                        <p>Your video is being processed.</p>
                        <Spacer y={4} />
                        <Button
                            hidden={true}
                            color="primary"
                            isLoading={isFetching}
                            onPress={handleFetchClick}>
                            Check video status
                        </Button>
                        <Spacer y={4} />
                    </div>
                    <video hidden={vidOutput?.status !== 'success'} width={520} loop controls autoPlay src={vidOutput?.mediaUrl} />
                </CardBody>
            </Card>

        </section >
    )
}