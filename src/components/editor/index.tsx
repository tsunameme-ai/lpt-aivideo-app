'use client'
import { useEffect, useRef, useState } from "react"
import TextBlock, { TextBlockProps } from "./text-block"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import { Button, Spinner, useDisclosure } from "@nextui-org/react"
import RemoteImage from "../remote-image"
import { SDAPI } from "@/libs/sd-api"
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH } from "@/libs/types"
import EditTextModalComponent from "@/components/edit-text-modal"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdOutlineTextFields } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import styles from "@/styles/home.module.css"

export const StartRenderEvent = 'StartRender'

interface EditorProps {
    imageUrl: string
    onImagesRendered?: (stageImgDataUrl: string, coverImgDataUrl: string, width: number, height: number) => void
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const coverLayerRef = useRef<any>()
    const stageRef = useRef<any>()
    const [deleteBtnVariant, setDeleteBtnVariant] = useState<'light' | 'flat' | 'bordered'>('light')
    const [deleteBtnColor, setDeleteBtnColor] = useState<'danger' | 'default'>('default')
    const [image, setImage] = useState<HTMLImageElement>()
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [outputDimension, setOutputDimension] = useState<{ pixelRatio: number, width: number, height: number }>({ pixelRatio: 1.0, width: 0, height: 0 })
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [isTextBlockDragging, setIsTextBlockDragging] = useState<boolean>(false)
    const [isRenderRequested, setIsRenderRequested] = useState<boolean>(false)
    const DELETE_ZONE_X = 305
    const DELETE_ZONE_Y = 150
    const handleMouseDown = (e: any) => {
        try {
            e.preventDefault()
        }
        catch (e) {

        }
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
            setSelectedId(undefined)
        }

    }

    const resize = (img: any) => {
        if (!img) {
            return
        }

        const { width: imgWidth, height: imgHeight } = SDAPI.resizeToFit(img.width, img.height, DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT)

        let editorH = window.innerHeight
        const editorWrapperElement = document.getElementById('editor-wrapper');
        let editorW = editorWrapperElement?.clientWidth ?? 0
        if (img) {
            editorW = Math.min(editorW, imgWidth)
            editorH = editorW / imgWidth * imgHeight
        }
        setWidth(editorW)
        setHeight(editorH)
        setOutputDimension({ pixelRatio: imgWidth / editorW, width: imgWidth, height: imgHeight })

        // props.onPixelRatio?.(imgWidth / editorW, imgWidth, imgHeight)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleOpenModal = () => {

        if (selectedId || Object.keys(textBlocks).length <= 0)
            onOpen()
    }
    const handleCloseModal = (text: string, slider: number) => {

        if (text.replaceAll(' ', '').replaceAll('\n', '').length <= 0) {
            onClose()
            return
        }

        const key = `rect${Object.keys(textBlocks).length}`
        Object.keys(textBlocks).forEach(key => {
            delete textBlocks[key]
        })

        textBlocks[key] = {
            id: key,
            isSelected: false,
            text: text,
            opacity: slider,
            fill: 'black',
            background: 'white',
            align: 'center',
            x: 0,
            y: 0,
            stageWidth: width,
            stageHeight: height
        }
        onClose()
    }

    const handleTextBlockDragging = (e: any) => {

        if (!height || !width)
            return

        //move to the deletion zone
        if (e.evt.touches[0].clientX >= DELETE_ZONE_X && e.evt.touches[0].clientY <= DELETE_ZONE_Y) {
            setDeleteBtnVariant('bordered')
            setDeleteBtnColor('danger')
        } else {
            setDeleteBtnVariant('light')
            setDeleteBtnColor('default')
        }

        //console.log(e.target.attrs.x + '  ' + e.evt.changedTouches[0]?.clientX)
        //console.log(e.target.attrs.x - e.evt.changedTouches[0]?.clientX)
    }

    const handleTextBlockDragEnd = (e: any) => {

        //Inside the deletion zone when drag ends
        if (e.evt.changedTouches[0]?.clientX >= DELETE_ZONE_X && e.evt.changedTouches[0]?.clientY <= DELETE_ZONE_Y) {
            if (selectedId) {
                delete textBlocks[selectedId]
                setSelectedId(undefined)
                toast.warning("Text deleted", {
                    toastId: 'delete notification',
                    autoClose: 1200,
                    hideProgressBar: true
                })
            }

        }
    }
    const onRenderRequested = () => {
        setIsTextBlockDragging(false)
        setSelectedId(undefined)
        setIsRenderRequested(true)
    }
    useEffect(() => {
        if (isRenderRequested) {
            const imgDataUrl = stageRef.current?.toDataURL({ pixelRatio: outputDimension.pixelRatio })
            const coverDataUrl = coverLayerRef.current?.toDataURL({ pixelRatio: outputDimension.pixelRatio })
            props.onImagesRendered?.(imgDataUrl, coverDataUrl, outputDimension.width, outputDimension.height)
            setIsRenderRequested(false)
        }
    }, [isRenderRequested])


    useEffect(() => {
        const onResize = () => {
            resize(image)
        }
        onResize()
        window.addEventListener('resize', onResize)
        window.addEventListener(StartRenderEvent, onRenderRequested)
        return () => {
            window.removeEventListener('resize', onResize)
            window.removeEventListener(StartRenderEvent, onRenderRequested)
        }
    }, [])

    return (
        <>
            <ToastContainer />
            <RemoteImage src={props.imageUrl} onComplete={(imgLocalUrl) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img)
                    resize(img)
                }
                img.src = imgLocalUrl
            }} />

            <EditTextModalComponent initialText={selectedId ? textBlocks[selectedId]?.text : ''} initialOpacity={0.3} isOpen={isOpen} onClose={handleCloseModal} />
            <div id='editor-wrapper'>
                {image ? <>
                    <div id='editor-container'>
                        <Stage
                            ref={stageRef}
                            style={{ position: 'absolute' }}
                            width={width}
                            height={height}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}>
                            <Layer>
                                <KonvaImage listening={false} x={0} y={0} width={width} height={height} image={image} />
                            </Layer>
                            <Layer
                                ref={coverLayerRef}>
                                {
                                    Object.keys(textBlocks).map((key, i) => {
                                        const rect = textBlocks[key]
                                        return (
                                            <TextBlock
                                                key={i}
                                                {...rect}
                                                isSelected={rect.id === selectedId}
                                                onSelect={(rid) => {
                                                    setSelectedId(rid)
                                                }}
                                                onRequestEdit={() => {
                                                    handleOpenModal()
                                                }}
                                                onDragging={(e) => {
                                                    handleTextBlockDragging(e)
                                                }}
                                                onDragStart={(e) => {
                                                    setSelectedId(rect.id)
                                                    setIsTextBlockDragging(true)
                                                    e
                                                }}
                                                onDragEnd={(e) => {
                                                    setIsTextBlockDragging(false)
                                                    setSelectedId(undefined)
                                                    handleTextBlockDragEnd(e)
                                                }}

                                            />
                                        )
                                    })}
                            </Layer>
                        </Stage>
                    </div >
                    {Object.keys(textBlocks).length <= 0 && <div className={`flex justify-center items-center`} style={{
                        width: `${width}px`,
                        height: `${height}px`,
                    }}>
                        <Button color="secondary" variant="bordered" radius="sm" size='lg' onPress={handleOpenModal}>
                            <div className='text-[20px]'>Tap here to add text</div></Button>
                    </div>}
                </> : <Spinner />}
            </div >


            {
                isTextBlockDragging && <>
                    <Button isIconOnly variant={deleteBtnVariant} className={styles.deleteTextBtn}
                        onPress={() => { }} color={deleteBtnColor}
                        radius="none"
                    >
                        <MdDelete size={26} />
                    </Button>
                </>
            }
        </>
    );
};
export default Editor