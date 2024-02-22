import { GenerationOutput, GenerationRequest, /*GenerationType*/ } from "@/libs/types"
import { /*Button,*/ Spacer, Input } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"
import styles from "@/styles/home.module.css"
import LongrunIndicator from "../longrun-indicator"
import { useGenerationContext } from "@/context/generation-context";

interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageUrl: string
    width: number
    height: number
    onError?: (error: any) => void
    onVideoGenerated?: (videoOutputs: Array<GenerationOutput>) => void
    isGeneratingVideo: boolean
    img2VidRequest: GenerationRequest | undefined
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const gContext = useGenerationContext()
    //const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [width, setWidth] = useState<string>(props.width.toString())
    const [height, setHeight] = useState<string>(props.height.toString())
    const [motionBucketId, setMotionBucketId] = useState<string>('127')
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>('0.05')
    const [seed, setSeed] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [img2VidRequest/*, setImg2VidRequest*/] = useState<GenerationRequest>()

    const onVideoGenerated = (outputs: Array<GenerationOutput>) => {
        //setIsGeneratingVideo(false)
        setErrorMessage('')
        props.onVideoGenerated?.(outputs)
    }

    const onError = (e: Error) => {
        setErrorMessage(e.message)
        //setIsGeneratingVideo(false)
    }

    const updateHeight = (v: string) => {
        console.log('height: ' + v)
        //console.log('parseInt: ' + parseInt(v))
        gContext.setVideoHeight(parseInt(v))
        console.log('gheight1: ' + gContext.videoHeight)
        setHeight(v)
    }

    const updateWidth = (v: string) => {
        setWidth(v)
        gContext.setVideoWidth(parseInt(v))
        console.log(gContext.videoWidth)
    }

    const updateSeed = (v: string) => {
        setSeed(v)
        gContext.setVideoSeed(parseInt(v))
    }

    const updateNoiseAugStrength = (v: string) => {
        setNoiseAugStrength(v)
        gContext.setVideoNoiseAugStrength(parseInt(v))
    }
    /*
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
                    setIsGeneratingVideo(true)
                }
                else {
                    throw new Error('Unable to generate request')
                }
            }
            catch (e: any) {
                setErrorMessage(`Unable to generate video: ${e.message}`)
                setIsGeneratingVideo(false)
            }
        }
    */

    /*       
        <Button
            className="w-full"
            color="primary"
            isLoading={isGeneratingVideo}
            onPress={handleGenerateVideoClick}>
            Generate Video
        </Button>
    */
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
                                onValueChange={updateWidth} />
                            <Input
                                label='Height'
                                type='number'
                                value={height}
                                onValueChange={updateHeight} />
                            <Input
                                label='Motion Bucket Id'
                                type='number'
                                value={motionBucketId}
                                onValueChange={setMotionBucketId} />
                            <Input
                                label='Noise Aug Strength'
                                type='number'
                                value={noiseAugStrength}
                                onValueChange={updateNoiseAugStrength}
                            />
                            <Input
                                label='Seed'
                                type='number'
                                value={seed}
                                onValueChange={updateSeed}
                            />
                        </div>}

                    <Spacer y={1}></Spacer>

                    <p className="text-base">
                        Video generation will take a few minutes. Please do not close the tab while waiting for the video.
                    </p>
                    <Spacer y={5}></Spacer>
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