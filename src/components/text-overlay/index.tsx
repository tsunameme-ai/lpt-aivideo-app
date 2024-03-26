import { Spacer, Textarea } from "@nextui-org/react"
import { useState } from "react"
import ImageWithTextOverlay from "../image-text-overlay"
import { FaFileDownload/*, FaShare */ } from "react-icons/fa"
import styles from "@/styles/home.module.css";
import { LocalImageData } from "@/libs/types";
import { Analytics } from "@/libs/utils";

interface TextOverlayProps {
    src: string
    text: string,
    onImageData: (text: string, localImage: LocalImageData) => void
    onDownloadClick: () => void
}
const TextOverlay: React.FC<TextOverlayProps> = (props: TextOverlayProps) => {
    const [text, setText] = useState<string>(props.text)
    const [imageLoaded, setImageLoaded] = useState<boolean>(false)

    const onImageData = (text: string, localImage: LocalImageData) => {
        props.onImageData?.(text, localImage)
        setImageLoaded(true)
    }

    const onDownloadClick = () => {
        props.onDownloadClick()
        Analytics.trackEvent({ 'event': 'click-download-image' })
    }

    //<FaShare className={styles.shareIcon} />
    return (<>
        <Textarea
            maxRows={4}
            label=''
            placeholder='Write your creative copies here. The text can be multiple lines.'
            value={text}
            onValueChange={setText}
        />
        <Spacer y={2} />
        <div className={styles.containerRelative}>
            {imageLoaded &&
                <>
                    <FaFileDownload className={styles.downloadIcon} onClick={onDownloadClick} />
                </>
            }
            <ImageWithTextOverlay
                onImageData={onImageData}
                imageUrl={props.src}
                text={text} />
        </div>
    </>)
}

export default TextOverlay