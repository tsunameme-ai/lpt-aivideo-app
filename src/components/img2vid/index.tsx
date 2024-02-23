import { GenerationOutput, GenerationRequest, GenerationType } from "@/libs/types"
import { Button, Spacer, Input } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"
import styles from "@/styles/home.module.css"
import LongrunIndicator from "../longrun-indicator"


interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageUrl: string
    coverImageDataURL?: string
    textImageDataURL?: string
    width: number,
    height: number
    onError?: (error: any) => void
    onVideoGenerated?: (videoOutputs: Array<GenerationOutput>) => void
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [width, setWidth] = useState<string>(props.width.toString())
    const [height, setHeight] = useState<string>(props.height.toString())
    const [motionBucketId, setMotionBucketId] = useState<string>('127')
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>('0.05')
    const [seed, setSeed] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()

    const onVideoGenerated = async (outputs: Array<GenerationOutput>) => {
        if (props.textImageDataURL) {
            setIsGeneratingVideo(true)
            setErrorMessage('')
            try {
                const body = {
                    'width': width,
                    'video_url': outputs[0].mediaUrl,
                    'image_data': props.textImageDataURL
                }
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: JSON.stringify(body)
                })
                console.log(`${res.status}`)
                if (res.ok) {
                    console.log(res)
                    const { url } = await res.json()
                    onVideoGenerateComleted([{
                        mediaUrl: url,
                        seed: outputs[0].seed
                    }])
                }
                else {
                    throw new Error(`Unable to overlay image on video ${res.status}`)
                }
            }
            catch (e: any) {
                setErrorMessage(e.message || 'Unable to overlay image on video')
            }
            finally {
                setIsGeneratingVideo(false)
            }
        }
        else {
            onVideoGenerateComleted(outputs)
        }
        // setIsGeneratingVideo(false)
        // setErrorMessage('')
        // props.onVideoGenerated?.(outputs)

    }
    const onVideoGenerateComleted = (outputs: Array<GenerationOutput>) => {
        setIsGeneratingVideo(false)
        setErrorMessage('')
        props.onVideoGenerated?.(outputs)
    }

    const onError = (e: Error) => {
        setErrorMessage(e.message)
        setIsGeneratingVideo(false)
    }

    const handleGenerateVideoClick = async () => {
        setIsGeneratingVideo(true)
        setErrorMessage('')
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify({
                    type: GenerationType.IMG2VID, input: {
                        imageUrl: props.imageUrl,
                        width: parseInt(width),
                        height: parseInt(height),
                        motionButcketId: parseInt(motionBucketId),
                        noiseAugStrength: parseFloat(noiseAugStrength),
                        seed: seed
                    }
                }),
            })
            const generationRequest = await response.json()
            if (generationRequest) {
                setImg2VidRequest(generationRequest)
            }
            else {
                throw new Error('Unable to generate request')
            }
        }
        catch (e: any) {
            setErrorMessage(`Unable to generate video: ${e.message}`)
        }
        finally {
            setIsGeneratingVideo(false)
        }
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    {props.isAdvancedView &&
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                label='Width'
                                type='number'
                                value={width}
                                onValueChange={setWidth} />
                            <Input
                                label='Height'
                                type='number'
                                value={height}
                                onValueChange={setHeight} />
                            <Input
                                label='Motion Bucket Id'
                                type='number'
                                value={motionBucketId}
                                onValueChange={setMotionBucketId} />
                            <Input
                                label='Noise Aug Strength'
                                type='number'
                                value={noiseAugStrength}
                                onValueChange={setNoiseAugStrength} />
                            <Input
                                label='Seed'
                                type='number'
                                value={seed}
                                onValueChange={setSeed}
                            />
                        </div>}

                    <Spacer y={1}></Spacer>

                    <p className="text-base">
                        Video generation will take a few minutes. Please do not close the tab while waiting for the video.
                    </p>
                    <Spacer y={5}></Spacer>
                    <Button
                        className="w-full"
                        color="primary"
                        isLoading={isGeneratingVideo}
                        onPress={handleGenerateVideoClick}>
                        Generate Video
                    </Button>
                    {img2VidRequest &&
                        <LongrunIndicator request={img2VidRequest}
                            onError={onError}
                            onComplete={onVideoGenerated}
                        />}
                </div>
                <ErrorComponent errorMessage={errorMessage} />
            </section>

        </>
    );
};

export default Img2VidComponent