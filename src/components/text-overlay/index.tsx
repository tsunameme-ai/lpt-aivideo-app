import { Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
import { FaFileDownload, FaShare } from "react-icons/fa";
import styles from "@/styles/home.module.css";

interface TextOverlayProps {
    src: string
    text: string,
    onImageData: (text: string, imgDataURL: string, width: number, height: number) => void
    onDownloadClick: () => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>(props.text)
    const [imageDataURL, setImageDataURL] = useState<string>()
    const [imageLoaded, setImageLoaded] = useState<boolean>(false)

    const onImageData = (text: string, imgDataUrl: string, overlayImgDataUrl: string, width: number, height: number) => {
        setImageDataURL(imgDataUrl)
        props.onImageData?.(text, imgDataUrl, overlayImgDataUrl, overlayImgDataUrl, width, height)
        setImageLoaded(true)
    }

    const onDownloadClick = () => {
        props.onDownloadClick()
    }

    return (<>
        <Textarea
            label='Try something sassy'
            placeholder=''
            value={text}
            onValueChange={setText}
        />
        <Spacer y={4} />
        <div className={styles.containerRelative}>
            {imageLoaded &&
                <>
                    <FaFileDownload className={styles.downloadIcon} onClick={onDownloadClick} />
                    <FaShare className={styles.shareIcon} />
                </>
            }
            <ImageWithTextOverlay
                onImageData={onImageData}
                imageUrl={props.src}
                text={text} />
        </div>
        {imageDataURL &&
            <><Spacer y={4} /></>
        }
    </>)
}

export default TextOverlay