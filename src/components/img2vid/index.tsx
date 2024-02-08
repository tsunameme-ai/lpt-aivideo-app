import { GenerationOutput } from "@/libs/types"
import { Button, Spacer, Input } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"
import { img2vid } from "@/actions/stable-diffusion"
import GImage from "../gimage"


interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageUrl: string
    onError?: (error: any) => void
    onVideoGenerated?: (videoOutput: GenerationOutput) => void
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [motionBucketId, setMotionBucketId] = useState<string>('127')
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>('0.05')
    const [seed, setSeed] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>('')


    const handleGenerateVideoClick = async () => {
        setIsGeneratingVideo(true)
        try {
            const output = await img2vid({
                imageUrl: props.imageUrl,
                motionButcketId: parseInt(motionBucketId),
                noiseAugStrength: parseFloat(noiseAugStrength),
                seed: seed
            })
            // console.log(output)
            if (props.onVideoGenerated) {
                props.onVideoGenerated(output)
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

            <div >
                <GImage alt='preview' src={props.imageUrl} />
                <Spacer y={3} />
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
                <Spacer y={3}></Spacer>
                <Button
                    size="lg"
                    color="primary"
                    isLoading={isGeneratingVideo}
                    onPress={handleGenerateVideoClick}>
                    Go Back
                </Button>

                <Button
                    size="lg"
                    color="primary"
                    isLoading={isGeneratingVideo}
                    onPress={handleGenerateVideoClick}>
                    Generate Video
                </Button>

                {/* <small>Video generation will take a few minutes. Please wait patiently. Don't close the tab.</small> */}
                <ErrorComponent errorMessage={errorMessage} />
            </div>

        </>
    );
};

export default Img2VidComponent