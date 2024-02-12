import { GenerationOutput, GenerationRequest, GenerationType } from "@/libs/types"
import { Button, Spacer, Input } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"
import styles from "@/styles/home.module.css"
import LongrunIndicator from "../longrun-indicator"


interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageUrl: string
    onError?: (error: any) => void
    onVideoGenerated?: (videoOutputs: Array<GenerationOutput>) => void
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [motionBucketId, setMotionBucketId] = useState<string>('127')
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>('0.05')
    const [seed, setSeed] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [img2VidRequest, setImg2VidRequest] = useState<GenerationRequest>()

    const onVideoGenerated = (outputs: Array<GenerationOutput>) => {
        setIsGeneratingVideo(false)
        setErrorMessage('')
        if (props.onVideoGenerated) {
            props.onVideoGenerated(outputs)
        }
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

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    {props.isAdvancedView &&
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                label='Motion Bucket Id'
                                type='number'
                                value={motionBucketId}
                                onValueChange={setMotionBucketId}
                            />
                            <Input
                                label='Noise Aug Strength'
                                type='number'
                                value={noiseAugStrength}
                                onValueChange={setNoiseAugStrength}
                            />
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