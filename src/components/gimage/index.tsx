import { Button, Spinner, Image } from "@nextui-org/react"
import { useEffect, useState } from "react"
import ErrorComponent from "../error"

interface GImageProps {
    src: string
    alt?: string
}

const GImage: React.FC<GImageProps> = (props: GImageProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [imageFileUrl, setImageFileUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        downloadImage()
            .catch(console.error)
    }, [props.src])

    const downloadImage = async () => {
        setIsFetching(true)
        try {
            const res = await fetch('/api/image', {
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify({ url: props.src }),
            });

            if (!res.ok) {
                throw new Error(`Image download failed with status ${res.status}`);
            }

            const blob = await res.blob();
            const fileUrl = URL.createObjectURL(blob);
            setImageFileUrl(fileUrl);
            setErrorMessage('');

        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message);
        }
        finally {
            setIsFetching(false)
        }
    }
    return (
        <div style={{ border: '1px solid #f00' }}>
            <small>{props.src}</small>
            {imageFileUrl && <Image alt={props.alt} src={imageFileUrl} />}
            {isFetching && <Spinner />}
            {errorMessage.length > 0 && <>
                <ErrorComponent errorMessage={errorMessage} />
                <Button onClick={downloadImage}>Retry</Button>
            </>}
        </div>
    )
}
export default GImage