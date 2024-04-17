import { useState } from "react"
import { Image } from "@nextui-org/react"


interface MediaPlayerComponentProps {
    // width: number
    // height: number
    src: string
    className: string
    onLoad?: () => void
}
const MediaPlayerComponent: React.FC<MediaPlayerComponentProps> = (props: MediaPlayerComponentProps) => {
    const checkIsVideo = (url: string) => {
        const segs = url.split('.')
        const ext = segs[segs.length - 1].toLowerCase()
        return ['mp4'].includes(ext)
    }
    const [isVideo] = useState<boolean>(checkIsVideo(props.src))
    return (
        isVideo ? <video className={props.className} autoPlay loop muted controls webkit-playsinline playsInline src={props.src} onCanPlay={props.onLoad} />
            : <Image className={props.className} src={props.src} alt='image' onLoad={props.onLoad} />
    )
}
export default MediaPlayerComponent