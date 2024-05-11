import { useEffect } from "react"

interface RemoteImageProps {
    src: string
    alt?: string
    onError?: (error: any) => void
    onComplete?: (imageFileUrl: string) => void
    onLoadingState?: (isloading: boolean) => void
}

const RemoteImage: React.FC<RemoteImageProps> = (props: RemoteImageProps) => {
    useEffect(() => {
        const downloadImage = async () => {
            if (props.onLoadingState) {
                props.onLoadingState(true)
            }
            try {
                const res = await fetch(`/api/image?url=${props.src}`)
                if (!res.ok) {
                    throw new Error(`Image download failed with status ${res.status}`);
                }

                const blob = await res.blob();
                const fileUrl = URL.createObjectURL(blob)
                if (props.onComplete) {
                    props.onComplete(fileUrl)
                }

            } catch (error: any) {
                console.error(error);
                if (props.onError) {
                    props.onError(error)
                }
            }
            finally {
                if (props.onLoadingState) {
                    props.onLoadingState(true)
                }
            }
        }

        downloadImage()
            .catch()
    }, [props.src])


    return (<></>)
}
export default RemoteImage