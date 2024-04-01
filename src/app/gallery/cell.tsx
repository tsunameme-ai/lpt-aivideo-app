import MediaPlayerComponent from "@/components/media-player"
import { FaShare } from "react-icons/fa"
import styles from "@/styles/home.module.css"
import { Skeleton } from "@nextui-org/react"
import { useEffect, useState } from "react"

interface GalleryCellProps {
    src: string
    handleClickShare?: (url: string) => void
}

const GalleryCell: React.FC<GalleryCellProps> = (props: GalleryCellProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
    }, [])
    return (
        <>
            <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
                <MediaPlayerComponent className={styles.videoPreview} src={props.src}
                    onLoad={() => {
                        setIsLoading(false)
                    }} />
                <FaShare className={styles.galleryShareIcon} onClick={() => props.handleClickShare?.(props.src)} />
            </Skeleton>
        </>
    )
}
export default GalleryCell