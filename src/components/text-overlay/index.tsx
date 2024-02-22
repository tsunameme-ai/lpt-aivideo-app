

import { Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
interface TextOverlayProps {
    src: string
    text: string,
    onImageData: (text: string, imgDataURL: string, textImageDataURL: string | undefined, width: number, height: number) => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>(props.text)

    const onImageData = (text: string, imageDataURL: string, textImageDataURL: string | undefined, width: number, height: number) => {
        props.onImageData?.(text, imageDataURL, textImageDataURL, width, height)
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
    </>)
}

export default TextOverlay