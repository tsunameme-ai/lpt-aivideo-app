import { API } from "@/api/api";
import { GenerationOutput } from "@/api/types";
import { Button, Slider, Spacer, Image } from "@nextui-org/react";
import { useState } from "react";
import ErrorComponent from "../error";


interface Img2VidComponentProps {
    onError?: (error: any) => void
    onVideo?: (videoOutput: GenerationOutput) => void
    imageOutput: GenerationOutput
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false)
    const [motionBucketId, setMotionBucketId] = useState<number | number[]>(127)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const fetchImageAsFile = async (url: string): Promise<File> => {
        const response = await fetch(`http://localhost:3000/api/image`, { method: 'POST', body: JSON.stringify({ url }) });
        if (response.ok) {
            const blob = await response.blob()
            // return blob
            const file = new File([blob], 'image.png', { type: 'image/png' })
            // console.log('fetchImageAsFile ???')
            // console.log(file)
            return file
        }
        throw new Error(`Fetch image failed`)
    }

    const handleGenerateVideoClick = async () => {
        // console.log('handleGenerateVideoClick')
        setIsGeneratingVideo(true)
        let imgFile = null
        if (imageFile === null) {
            try {
                imgFile = await fetchImageAsFile(props.imageOutput.mediaUrl!)
                setImageFile(imgFile)
            }
            catch (e: any) {
                setErrorMessage(`Unable to fetch image data: ${e.message}`)
                if (props.onError) {
                    props.onError(e)
                }
            }
        }
        else {
            imgFile = imageFile
        }
        if (!imgFile) {
            setIsGeneratingVideo(false)
            return
        }

        try {
            const output = await API.img2vid({
                imageFile: imgFile,
                motionButcketId: motionBucketId as number
            })
            if (props.onVideo) {
                props.onVideo(output)
            }
            //TODO goto video once res is successful
            // setErrorMessage(JSON.stringify(res))
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
            <Image width={520} src={props.imageOutput.mediaUrl} />
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
            <Spacer y={4} />
            <Button
                color="primary"
                isLoading={isGeneratingVideo}
                onPress={handleGenerateVideoClick}>
                Generate Video
            </Button>
            <ErrorComponent errorMessage={errorMessage} />
            {imageBlobUrl && <img src={imageBlobUrl!} width={512} />}
        </>
    );
};

export default Img2VidComponent




// const ImageComponent: React.FC = () => {
//     const [imageSrc, setImageSrc] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchImage = async () => {
//             try {
//                 // const response = await fetch('/api/fetch-image');
//                 const url = 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-964f8944-85d8-41d2-963a-0b7f2ce4e9e9.png'
//                 // const response = await fetch(`/api/image?url=${encodeURIComponent(url)}`, { method: 'POST' });
//                 const response = await fetch(`http://localhost:3000/api/image?url=${encodeURIComponent(url)}`, { method: 'POST', body: JSON.stringify({ url }) });

//                 console.log(response)
//                 if (response.ok) {
//                     const blob = await response.blob();
//                     console.log('blob')
//                     console.log(blob)
//                     const imageUrl = URL.createObjectURL(blob);
//                     console.log(imageUrl)
//                     setImageSrc(imageUrl);
//                 } else {
//                     console.error('Error fetching image:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error fetching image:', error);
//             }
//         };

//         fetchImage();

//         return () => {
//             // Clean up resources if necessary
//         };
//     }, []);

//     return (
//         <div>
//             {imageSrc && <img src={imageSrc} alt="Remote Image" />}
//         </div>
//     );
// };

// export default ImageComponent;