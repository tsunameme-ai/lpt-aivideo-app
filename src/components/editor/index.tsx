'use client'
import { useEffect, useRef, useState } from "react"
import TextBlock, { TextBlockProps } from "./text-block"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import { Button, Skeleton, useDisclosure } from "@nextui-org/react"
import RemoteImage from "../remote-image"
import { SDAPI } from "@/libs/sd-api"
import EditTextModalComponent from "@/components/edit-text-modal"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdDelete } from "react-icons/md"
import styles from "@/styles/home.module.css"
import { StartOutputEvent } from "./types"
import { appFont } from "@/app/fonts"
import { preventEventDefault } from "./utils"


interface EditorProps {
    width: number,
    height: number,
    imageUrl: string
    onImagesRendered?: (stageImgDataUrl: string, coverImgDataUrl: string, width: number, height: number) => void
}
type Dimension = { width: number, height: number }

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const coverLayerRef = useRef<any>()
    const stageRef = useRef<any>()
    const [deleteBtnVariant, setDeleteBtnVariant] = useState<'light' | 'flat' | 'bordered'>('light')
    const [deleteBtnColor, setDeleteBtnColor] = useState<'danger' | 'default'>('default')
    const [image, setImage] = useState<HTMLImageElement>()
    const [canvasDimension, setCanvasDimension] = useState<Dimension>({ width: props.width, height: props.height })
    const [outputDimension, setOutputDimension] = useState<{ pixelRatio: number, width: number, height: number }>({ pixelRatio: 1.0, width: 0, height: 0 })
    const [watermark, setWatermark] = useState<HTMLImageElement>()
    const [watermarkDimension, setWatermarkDimension] = useState<Dimension>({ width: 0, height: 0 })
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [isTextBlockDragging, setIsTextBlockDragging] = useState<boolean>(false)
    const [isOutputRequested, setIsOutputRequested] = useState<boolean>(false)
    const DELETE_ZONE_SIZE = 50
    const handleMouseDown = (e: any) => {
        preventEventDefault(e)
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
            setSelectedId(undefined)
        }
    }

    const resize = (inputWidth: number, inputHeight: number) => {
        const { width: imgWidth, height: imgHeight } = SDAPI.resizeToFit(inputWidth, inputHeight, props.width, props.height)

        let editorH = window.innerHeight
        const editorWrapperElement = document.getElementById('editor-wrapper');
        let editorW = editorWrapperElement?.clientWidth ?? 0
        editorW = Math.min(editorW, imgWidth)
        editorH = editorW / imgWidth * imgHeight
        setCanvasDimension({ width: editorW, height: editorH })
        setOutputDimension({ pixelRatio: imgWidth / editorW, width: imgWidth, height: imgHeight })
    }

    useEffect(() => {
        if (watermark) {
            setWatermarkDimension({ width: canvasDimension.width * watermark.width / 1024, height: canvasDimension.height * watermark.height / 1024 })
        }

    }, [watermark, canvasDimension])

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
        const segs = appFont.className.split('_')

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
            stageWidth: canvasDimension.width,
            stageHeight: canvasDimension.height,
            fontFamily: `__Work_Sans_${segs[segs.length - 1]}`
        }
        setSelectedId(key)
        onClose()
    }
    const isInDeleteZone = (x: number, y: number): boolean => {
        return x >= canvasDimension.width - DELETE_ZONE_SIZE && y <= DELETE_ZONE_SIZE
    }

    const handleTextBlockDragging = (x: number, y: number) => {
        //move to the deletion zone
        if (isInDeleteZone(x, y)) {
            setDeleteBtnVariant('bordered')
            setDeleteBtnColor('danger')
        } else {
            setDeleteBtnVariant('light')
            setDeleteBtnColor('default')
        }
    }

    const handleTextBlockDragEnd = (x: number, y: number) => {
        //Inside the deletion zone when drag ends
        if (selectedId && isInDeleteZone(x, y)) {
            delete textBlocks[selectedId]
            setSelectedId(undefined)
            toast.warning("Caption deleted", {
                toastId: 'delete notification',
                autoClose: 1200,
                hideProgressBar: true
            })
        }
    }
    const onRenderRequested = () => {
        setIsTextBlockDragging(false)
        setSelectedId(undefined)
        setIsOutputRequested(true)
    }

    const onVisibilityChange = () => {
        if (!document.hidden) {
            stageRef?.current?.getStage()?.batchDraw()
        }
    }
    useEffect(() => {
        if (isOutputRequested) {
            const imgDataUrl = stageRef.current?.toDataURL({ pixelRatio: outputDimension.pixelRatio })
            const coverDataUrl = coverLayerRef.current?.toDataURL({ pixelRatio: outputDimension.pixelRatio })
            props.onImagesRendered?.(imgDataUrl, coverDataUrl, outputDimension.width, outputDimension.height)
            setIsOutputRequested(false)
        }
    }, [isOutputRequested])

    useEffect(() => {
        const onResize = () => {
            resize((image || props).width, (image || props).height)
        }
        onResize()
        window.addEventListener('resize', onResize)
        window.addEventListener(StartOutputEvent, onRenderRequested)

        const wmimg = new Image();
        wmimg.onload = () => {
            setWatermark(wmimg)
        }
        wmimg.src = '/watermark1024.png';
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener('resize', onResize)
            window.removeEventListener(StartOutputEvent, onRenderRequested)
            document.removeEventListener("visibilitychange", onVisibilityChange);
        }
    }, [])

    return (
        <>
            <ToastContainer />
            <RemoteImage src={props.imageUrl} onComplete={(imgLocalUrl) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img)
                    resize(img.width, img.height)
                }
                img.src = imgLocalUrl
            }} />
            {isOpen && image && <EditTextModalComponent imageUrl={props.imageUrl} width={canvasDimension.width} height={canvasDimension.height} text={selectedId ? textBlocks[selectedId]?.text : ''} opacity={0.4} isOpen={true} onClose={handleCloseModal} />}
            <div id='editor-wrapper' />
            <Skeleton isLoaded={image !== undefined}>
                <div className='flex' style={{
                    width: `${canvasDimension.width}px`,
                    height: `${canvasDimension.height}px`
                }}>
                    {image && <>
                        <Stage
                            ref={stageRef}
                            style={{ position: 'absolute' }}
                            width={canvasDimension.width}
                            height={canvasDimension.height}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}>
                            <Layer>
                                <KonvaImage listening={false} x={0} y={0} width={canvasDimension.width} height={canvasDimension.height} image={image} />
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
                                                onDragging={(x: number, y: number) => {
                                                    handleTextBlockDragging(x, y)
                                                }}
                                                onDragStart={() => {
                                                    setSelectedId(rect.id)
                                                    setIsTextBlockDragging(true)
                                                }}
                                                onDragEnd={(x: number, y: number) => {
                                                    setIsTextBlockDragging(false)
                                                    handleTextBlockDragEnd(x, y)
                                                }}

                                            />
                                        )
                                    })}
                                {watermark && <KonvaImage image={watermark} listening={false} x={canvasDimension.width - watermarkDimension.width} y={canvasDimension.height - watermarkDimension.height} width={watermarkDimension.width} height={watermarkDimension.height} />}
                            </Layer>
                        </Stage>
                        {Object.keys(textBlocks).length <= 0 &&
                            <div className="flex justify-center items-center w-full h-full">
                                <Button className="absolute left-1/2 transform -translate-x-1/2  border-3 border-dashed border-[#f97216] text-[24px] text-[#f97216]" variant="bordered" radius="none" size='lg' onPress={handleOpenModal}>
                                    Tap here to add caption</Button></div>}


                        {isTextBlockDragging && <Button isIconOnly variant={deleteBtnVariant} className={`ml-auto top-right-div ${styles.deleteTextBtn}`}
                            onPress={() => { }} color={deleteBtnColor}
                            radius="none">
                            <MdDelete size={26} />
                        </Button>}
                    </>}
                </div >
            </Skeleton>
        </>
    )
}
export default Editor