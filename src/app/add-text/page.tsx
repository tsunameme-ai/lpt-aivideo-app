'use client'
import dynamic from "next/dynamic";
import { useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button, Spacer } from "@nextui-org/react"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem } from "@/libs/types"
import styles from '@/styles/home.module.css'



const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const router = useRouter()
    const editorCoverLayerRef = useRef<any>()
    const editorStageRef = useRef<any>()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [editorDimension, setEditorDimension] = useState<{ pixelRatio: number, width: number, height: number }>({ pixelRatio: 1.0, width: DEFAULT_VIDEO_WIDTH, height: DEFAULT_VIDEO_HEIGHT })

    const handleClickToVideo = () => {
        const imgDataUrl = editorStageRef.current?.toDataURL({ pixelRatio: editorDimension.pixelRatio })
        const coverDataUrl = editorCoverLayerRef.current?.toDataURL({ pixelRatio: editorDimension.pixelRatio })
        if (!imgDataUrl) {
            setErrorMessage(`Error: image dataURL cannot be generated`)
            return
        }
        if (!imgDataUrl) {
            setErrorMessage(`Error: cover image dataURL cannot be generated`)
            return
        }
        if (!t2iOutput) {
            setErrorMessage(`Error: no image`)
            return
        }
        gContext.setOverlayImageData({
            remoteURL: t2iOutput?.url,
            dataURL: imgDataUrl,
            width: editorDimension.width,
            height: editorDimension.height,
            overlayImageDataURL: coverDataUrl
        })
        router.push('img2vid')
    }

    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div>Step 2: Add your copy</div>
                    <Spacer y={2}></Spacer>
                    {t2iOutput ?
                        <Editor
                            onPixelRatio={(ratio: number, width: number, height: number) => {
                                setEditorDimension({
                                    pixelRatio: ratio,
                                    width,
                                    height,
                                })
                            }}
                            stageRef={editorStageRef}
                            coverLayerRef={editorCoverLayerRef}
                            imageUrl={t2iOutput.url}
                        />
                        : <>
                            <ErrorComponent errorMessage="No image" />
                        </>}
                </div>

                {t2iOutput &&
                    <>
                        <Spacer y={4} />
                        <div className={styles.promptControls}>
                            <div>
                                <Button
                                    className={styles.nextBtn}
                                    onPress={handleClickToVideo}
                                    size="md"
                                >
                                    <h5>GIF it</h5>
                                </Button>
                            </div>
                            <Spacer y={4} />
                            <div>
                                <Button
                                    className={styles.backBtn}
                                    onClick={() => router.back()}
                                    size="md"
                                >
                                    <h5>Back</h5>
                                </Button>
                            </div>
                        </div>
                    </>}
                {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            </section >
        </>
    )
}