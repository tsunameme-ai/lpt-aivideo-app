

import { Button, Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
interface TextOverlayProps {
    src: string
    onImageData: (imgDataURL: string, width: number, height: number) => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>('')
    const [imageDataURL, setImageDataURL] = useState<string>()
    const handleClickDownload = () => {
        if (imageDataURL) {
            const link = document.createElement("a");
            link.href = imageDataURL;
            link.download = "image.png";
            link.click();
        }
    }
    const onImageData = (url: string, width: number, height: number) => {
        setImageDataURL(url)
        props.onImageData?.(url, width, height)
    }

    return (<>
        <small>{props.src}</small>
        <Textarea
            label='Cover Text'
            placeholder=''
            value={text}
            onValueChange={setText}
        />
        <Spacer y={4} />
        <ImageWithTextOverlay
            onImageData={onImageData}
            imageUrl={props.src}
            text={text} />
        {imageDataURL &&
            <>
                <Spacer y={4} />
                <Button color='primary' onPress={handleClickDownload}>Download Image</Button>
            </>}
    </>)
}

export default TextOverlay