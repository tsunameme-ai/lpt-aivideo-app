'use client'
import { Button, Card, CardBody, Spacer } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { API } from '@/api/api'
import { Txt2vidOutput } from "@/api/types"

export default function Page({ params }: { params: { vid: string } }) {
    const [vidOutput, setVidOutput] = useState<Txt2vidOutput | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        fetchVideo()
            .catch(console.error);
    }, [])


    const fetchVideo = async () => {
        setIsFetching(true)
        setErrorMessage('')

        try {
            const vid = await API.fetchVideo(params.vid)
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

                    <div hidden={errorMessage.length == 0}>
                        <Spacer y={1} />
                        <p className='text-tiny text-danger'>{errorMessage}</p>
                        <Spacer y={4} />
                    </div>
                    <video hidden={vidOutput?.status !== 'success'} width={520} loop controls autoPlay src={vidOutput?.mediaUrl} />
                </CardBody>
            </Card>

        </section >
    )
}