'use client'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import TextOverlay from "@/components/text-overlay"
import styles from '@/styles/home.module.css'

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [imageUrl, setImageUrl] = useState<string>()
    const [coverText, setCoverText] = useState<string>('')
    const [imageDataUrl, setImageDataUrl] = useState<string>()
    useEffect(() => {
        const imgurl = searchParams.get('imgurl')
        if (imgurl) {
            setImageUrl(imgurl)
        }
    }, [])

    const handleClickToVideo = () => {
        const segs = [
            `imgurl=${imageUrl}`,
            `cover=${encodeURI(coverText)}`
        ]
        if (searchParams.get('view') === 'advanced') {
            segs.push('view=advanced')
        }
        router.push(`/img2vid/?${segs.join('&')}`)
    }

    const handleClickDownload = () => {
        if (imageDataUrl) {
            const link = document.createElement("a");
            link.href = imageDataUrl;
            link.download = "image.png";
            link.click();
        }
    }
    const onTextOverlayChange = (text: string, imgurl: string) => {
        setCoverText(text)
        setImageDataUrl(imgurl)

    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div>Step 2: Add your copy</div>
                    <Spacer y={2}></Spacer>
                    {imageUrl && <>
                        <TextOverlay
                            src={imageUrl}
                            onChange={onTextOverlayChange} />
                        <Spacer y={2} />
                        <div className="promptControls">
                            <div className={styles.downloadImageBtn}>
                                <Button color='primary' onPress={handleClickDownload}>Download Image</Button>
                            </div>
                            <div className={styles.makeVideoBtn}>
                                <Button color='primary' onPress={handleClickToVideo}>Make a Video</Button>
                            </div>
                        </div>
                    </>}
                </div>
            </section>
        </>
    )
}