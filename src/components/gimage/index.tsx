import { Image } from "@nextui-org/react"
import { useState } from "react"
import ErrorComponent from "../error"


interface GImageProps {
    src: string
    alt?: string
}
const GImage: React.FC<GImageProps> = (props: GImageProps) => {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const onImageLoad = () => {
        setErrorMessage('')
    }
    const onImageLoadError = () => {
        setErrorMessage('Failed to fetch image')
    }

    return (
        <>
            <Image src={props.src} alt={props.alt} onLoad={onImageLoad} onError={onImageLoadError} />
            {errorMessage.length > 0 && <ErrorComponent errorMessage={errorMessage} />}
        </>
    )
}

export default GImage