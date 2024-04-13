'use client'
import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { StartOutputEvent } from "@/components/editor/types";
import { Spacer } from "@nextui-org/react";
import { DEFAULT_IMG_HEIGHT, DEFAULT_IMG_WIDTH } from "@/libs/types";

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
                        width={DEFAULT_IMG_WIDTH}
                        height={DEFAULT_IMG_HEIGHT}
                        onImagesRendered={onImagesRendered}
                        imageUrl="https://storage.googleapis.com/livepeer-ai-video-dev/e7d1c27a/c5af4d0b.png"
                    />
                </div>

                <div className={styles.centerSection}>
                    <Spacer y={4} />
                    <Button size='md' className='w-full font-medium' color='primary' radius='sm' onPress={() => {
                        window.dispatchEvent(new Event(StartOutputEvent))

                    }}>GIF it</Button>
                    <Spacer y={4} />
                    <Button size='md' className='w-full font-medium' color='primary' variant="ghost" radius='sm' onPress={() => router.back()}>Back</Button>
                </div>
                {stageImageDataUrl && <img src={stageImageDataUrl} />}
                {coverImageDataUrl && <img src={coverImageDataUrl} />}
            </section>
        </>
    )
}