import { GenerationOutput, GenerationRequest } from "@/libs/types"
import { Input } from "@nextui-org/react"
import { useState } from "react"
import { useGenerationContext } from "@/context/generation-context";

interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageUrl: string
    overlayImage?: string
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
    //const [errorMessage, setErrorMessage] = useState<string>('')
    //const [img2VidRequest/*, setImg2VidRequest*/] = useState<GenerationRequest>()

    /*    
        const onVideoGenerated = (outputs: Array<GenerationOutput>) => {
            //setIsGeneratingVideo(false)
            console.log('onVideoGenerated')
            setErrorMessage('onVideoGenerated')
            props.onVideoGenerated?.(outputs)
    
        }
    */
    /*
        const onError = (e: Error) => {
            setErrorMessage(e.message)
            //setIsGeneratingVideo(false)
        }
    */
    const updateHeight = (v: string) => {
        setHeight(v)
        gContext.setVideoHeight(parseInt(v))
    }

    const updateWidth = (v: string) => {
        setWidth(v)
        gContext.setVideoWidth(parseInt(v))
    }

    const updateSeed = (v: string) => {
        setSeed(v)
        gContext.setVideoSeed(parseInt(v))
    }

    const updateNoiseAugStrength = (v: string) => {
        setNoiseAugStrength(v)
        gContext.setVideoNoiseAugStrength(parseInt(v))
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div>
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
                </div>

            </section>

        </>
    );
};

export default Img2VidComponent