'use client'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Spacer } from '@nextui-org/react'
import { useGenerationContext } from '@/context/generation-context'
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem } from '@/libs/types'
import styles from '@/styles/home.module.css'
import { Analytics } from '@/libs/analytics'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const router = useRouter()
    const editorCoverLayerRef = useRef<any>()
    const editorStageRef = useRef<any>()
    const gContext = useGenerationContext()
    const [t2iOutput] = useState<GenerationOutputItem | undefined>(gContext.t2iSelectedOutput)
    const [editorDimension, setEditorDimension] = useState<{ pixelRatio: number, width: number, height: number }>({ pixelRatio: 1.0, width: DEFAULT_VIDEO_WIDTH, height: DEFAULT_VIDEO_HEIGHT })

    const handleClickToVideo = () => {

        const imgDataUrl = editorStageRef.current?.toDataURL({ pixelRatio: editorDimension.pixelRatio })
        const coverDataUrl = editorCoverLayerRef.current?.toDataURL({ pixelRatio: editorDimension.pixelRatio })
        if (!imgDataUrl) {
            toast.error('Image dataURL cannot be generated', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        if (!imgDataUrl) {
            toast.error('Cover image dataURL cannot be generated', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        if (!t2iOutput) {
            toast.error('No image', {
                toastId: 'Error notification',
                autoClose: 1200,
                hideProgressBar: true
            })

            return
        }

        gContext.setOverlayImageData({
            remoteURL: t2iOutput?.url,
            dataURL: imgDataUrl,
            width: editorDimension.width,
            height: editorDimension.height,
            overlayImageDataURL: coverDataUrl
        })

        Analytics.trackEvent({ 'event': 'click-img2vid' })
        router.push('img2vid')
    }

    return (
        <>
            <ToastContainer />
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div className='text-[20px]'>Step 2 of 3: Add your copy</div>
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
                                    <div className='text-[20px]'>GIF it</div>
                                </Button>
                            </div>
                            <Spacer y={4} />
                            <div>
                                <Button
                                    className={styles.backBtn}
                                    onClick={() => router.back()}
                                    size="md"
                                >
                                    <div className='text-[20px]'>Back</div>
                                </Button>
                            </div>
                        </div>
                    </>}
            </section >
        </>
    )
}