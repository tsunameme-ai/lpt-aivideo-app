'use client'
import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { StartOutputEvent } from "@/components/editor";

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const [stageImageDataUrl, setStageImageDataUrl] = useState<string>()
    const [coverImageDataUrl, setCoverImageDataUrl] = useState<string>()
    const onImagesRendered = (stageImg: string, coverImg: string) => {
        setStageImageDataUrl(stageImg)
        setCoverImageDataUrl(coverImg)

    }
    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <Editor
                        onImagesRendered={onImagesRendered}
                        imageUrl="https://storage.googleapis.com/livepeer-ai-video-dev/e7d1c27a/c5af4d0b.png"
                    />
                </div>
                <Button onPress={() => {
                    window.dispatchEvent(new Event(StartOutputEvent))

                }}>GIF it</Button>
                {stageImageDataUrl && <img src={stageImageDataUrl} />}
                {coverImageDataUrl && <img src={coverImageDataUrl} />}
            </section>
        </>
    )
}