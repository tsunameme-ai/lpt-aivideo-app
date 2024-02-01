import { GenerationOutput } from "@/libs/types"
import { Button, Slider, Spacer, Image } from "@nextui-org/react";
import { useState } from "react";
import ErrorComponent, { ErrorComponentStyle } from "../error"
import { img2vid } from "@/actions/img2vid";


interface Img2VidComponentProps {
    onError?: (error: any) => void
    onVideo?: (videoOutput: GenerationOutput) => void
    imageOutput: GenerationOutput
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [motionBucketId, setMotionBucketId] = useState<number | number[]>(127)
    const [errorMessage, setErrorMessage] = useState<string>('')


    const handleGenerateVideoClick = async () => {
        setIsGeneratingVideo(true)
        try {
            const output = await img2vid({
                imageUrl: props.imageOutput.mediaUrl,
                motionButcketId: motionBucketId as number
            })
            console.log(output)
            if (props.onVideo) {
                props.onVideo(output)
            }
        }
        catch (e: any) {
            setErrorMessage(`Unable to generatet video: ${e.message}`)
        }
        finally {
            setIsGeneratingVideo(false)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center">
                <Image src={props.imageOutput.mediaUrl} />
            </div>
            <Spacer y={4} />
            <Slider
                label='Motion Bucket Id'
                step={1}
                maxValue={255}
                minValue={0}
                defaultValue={127}
                value={motionBucketId}
                onChange={setMotionBucketId}
            />
            <ErrorComponent errorMessage="Video generation will take a few minutes. Please wait patiently. Don't close the tab." style={ErrorComponentStyle.Warning} />
            <Button
                color="primary"
                isLoading={isGeneratingVideo}
                onPress={handleGenerateVideoClick}>
                Generate Video
            </Button>
            {/* <small>Video generation will take a few minutes. Please wait patiently. Don't close the tab.</small> */}
            <ErrorComponent errorMessage={errorMessage} />
        </>
    );
};

export default Img2VidComponent