import { GenerationOutput } from "@/libs/types"
import { Button, Spacer, Image, Input } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"
import { img2vid } from "@/actions/img2vid"
import styles from "@/styles/home.module.css"


interface Img2VidComponentProps {
    isAdvancedView: boolean
    imageOutput: GenerationOutput
    onError?: (error: any) => void
    onVideo?: (videoOutput: GenerationOutput) => void
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
                imageUrl: props.imageOutput.mediaUrl,
                motionButcketId: parseInt(motionBucketId),
                noiseAugStrength: parseFloat(noiseAugStrength),
                seed: seed
            })
            console.log(output)
            if (props.onVideo) {
                props.onVideo(output)
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
                    <Image alt='preview' src={props.imageOutput.mediaUrl} />
                    <Spacer y={4} />
                    {props.isAdvancedView ??
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
                </div>


                {/* <small>Video generation will take a few minutes. Please wait patiently. Don't close the tab.</small> */}
                <ErrorComponent errorMessage={errorMessage} />

            </section>
        </>
    );
};

export default Img2VidComponent