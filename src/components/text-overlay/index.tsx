

import { /*Button,*/ Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
interface TextOverlayProps {
    src: string
    onChange: (text: string, url: string) => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>('')
    const [imageDataURL, setImageDataURL] = useState<string>()
    /*
    const handleClickDownload = () => {
        if (imageDataURL) {
            const link = document.createElement("a");
            link.href = imageDataURL;
            link.download = "image.png";
            link.click();
        }
    }*/
    const onImageDataURL = (url: string) => {
        setImageDataURL(url)
        props.onChange?.(text, url)
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
            onDataURL={onImageDataURL}
            imageUrl={props.src}
            text={text} />
        {imageDataURL &&
            <>
                <Spacer y={4} />

            </>}
    </>)
}

export default TextOverlay