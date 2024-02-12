import { useEffect, useState } from "react"

interface RemoteImageProps {
    hidden: boolean
    src: string
    alt?: string
    onError?: (error: any) => void
    onComplete?: (imageFileUrl: string) => void
    onLoadingState?: (isloading: boolean) => void
}

const RemoteImage: React.FC<RemoteImageProps> = (props: RemoteImageProps) => {
    const [imageFileUrl, setImageFileUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        downloadImage()
            .catch()
    }, [props.src])

    const downloadImage = async () => {
        if (props.onLoadingState) {
            props.onLoadingState(true)
        }
        try {
            const res = await fetch('/api/image', {
                method: 'POST',
                body: JSON.stringify({ url: props.src }),
            });

            if (!res.ok) {
                throw new Error(`Image download failed with status ${res.status}`);
            }

            const blob = await res.blob();
            const fileUrl = URL.createObjectURL(blob)
            console.log('???? generate file url')
            console.log(fileUrl)
            setImageFileUrl(fileUrl);
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
    return (
        <>
            {!props.hidden && imageFileUrl && <img alt={props.alt} src={imageFileUrl} />}
        </>
        // <>
        //     {imageFileUrl && <img alt={props.alt} src={imageFileUrl} />}
        // </>
    )
}
export default RemoteImage