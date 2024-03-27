import { useState } from "react"
import { Image } from "@nextui-org/react"


interface MediaPlayerComponentProps {
    src: string
    className: string
}
const MediaPlayerComponent: React.FC<MediaPlayerComponentProps> = (props: MediaPlayerComponentProps) => {
    const checkIsVideo = (url: string) => {
        const segs = url.split('.')
        const ext = segs[segs.length - 1].toLowerCase()
        return ['mp4'].includes(ext)
    }
    const [isVideo] = useState<boolean>(checkIsVideo(props.src))
    return (
        isVideo ? <video className={props.className} loop controls src={props.src} />
            : <Image className={props.className} src={props.src} alt='image' />
    )
}
export default MediaPlayerComponent