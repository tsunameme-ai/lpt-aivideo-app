'use client'
import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'
import { useState } from "react";
import { StartOutputEvent } from "@/components/editor/types";
import { Spacer } from "@nextui-org/react";
import { DEFAULT_IMG_HEIGHT, DEFAULT_IMG_WIDTH } from "@/libs/types";
import { PrimaryButton } from "@/components/buttons";

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
                        imageUrl="https://lpt-aivideo-src.s3.amazonaws.com/0Uw1ImolfC.png"
                    />
                </div>

                <div className={styles.centerSection}>
                    <Spacer y={4} />
                    <PrimaryButton onPress={() => {
                        window.dispatchEvent(new Event(StartOutputEvent))
                    }}>GIF it</PrimaryButton>
                    <Spacer y={4} />
                </div>
                {stageImageDataUrl && <img src={stageImageDataUrl} />}
                {coverImageDataUrl && <img src={coverImageDataUrl} />}
            </section>
        </>
    )
}