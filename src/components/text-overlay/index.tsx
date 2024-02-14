

import { Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
interface TextOverlayProps {
    src: string
    text: string,
    onImageData: (text: string, imgDataURL: string, width: number, height: number) => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>(props.text)
    const [imageDataURL, setImageDataURL] = useState<string>()

    const onImageData = (text: string, url: string, width: number, height: number) => {
        setImageDataURL(url)
        props.onImageData?.(text, url, width, height)
    }

    return (<>
        <Textarea
            label='Try something sassy'
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

            </>}
    </>)
}

export default TextOverlay