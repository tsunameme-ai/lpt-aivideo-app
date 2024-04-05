'use client'
import { useEffect, useState } from "react"
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
import { FaFileDownload } from "react-icons/fa"
import styles from "@/styles/home.module.css"

interface EditorProps {
    coverLayerRef?: any
    stageRef?: any
    imageUrl: string
    onPixelRatio?: (ratio: number, width: number, height: number) => void
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const [deleteBtnVariant, setDeleteBtnVariant] = useState<'light' | 'flat' | 'bordered'>('light')
    const [deleteBtnColor, setDeleteBtnColor] = useState<'danger' | 'default'>('default')
    const [image, setImage] = useState<HTMLImageElement>()
    const [watermark, setWatermark] = useState<HTMLImageElement>()
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [, setPixelRatio] = useState<number>(1.0)
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [IsTextBlockDragging, setIsTextBlockDragging] = useState<boolean>(false)
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
        setPixelRatio(imgWidth / editorW)
        props.onPixelRatio?.(imgWidth / editorW, imgWidth, imgHeight)
        //console.log(height)
        //console.log(editorH)
        //console.log(imgHeight)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpenModal = () => {
        if (selectedId || Object.keys(textBlocks).length <= 0)
            onOpen()
    }
    const handleCloseModal = (text: string, slider: number) => {
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
            x: 15,
            y: 15
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

    const handleDownload = () => {
        const dataUrl = props.stageRef.current?.toDataURL({ pixelRatio: 2 })
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = "image.png"
        link.click()
    }

    useEffect(() => {
        const onResize = () => {
            resize(image)
        }
        onResize()
        window.addEventListener('resize', onResize)

        const wmimg = new Image();
        wmimg.onload = () => {
            setWatermark(wmimg)
        }
        wmimg.src = '/watermark.png';

        return () => {
            window.removeEventListener('resize', onResize)
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
                };
                img.src = imgLocalUrl
            }} />

            <EditTextModalComponent initialText='' initialOpacity={0.3} isOpen={isOpen} onClose={handleCloseModal} />
            <div id='editor-wrapper'>
                {image ? <>
                    <div id='editor-container'>
                        <Stage
                            ref={props.stageRef}
                            style={{ position: 'absolute' }}
                            width={width}
                            height={height}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}
                        >
                            <Layer>
                                <KonvaImage listening={false} x={0} y={0} width={width} height={height} image={image} />
                                {watermark && <KonvaImage listening={false} x={width! - 143} y={height! - 38} width={143} height={38} image={watermark} />}
                            </Layer>
                            <Layer
                                ref={props.coverLayerRef}>
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
                </> : <Spinner />}
            </div>



            {!IsTextBlockDragging && <>
                <div className="max-w">
                    <Button isIconOnly variant="light" className={styles.addTextBtn} onPress={() => {
                        handleDownload()
                    }}> <FaFileDownload size={20} /></Button>

                    {(Object.keys(textBlocks).length <= 0) &&
                        <>
                            <Button isIconOnly variant="light" className={styles.addTextBtn} onPress={() => {
                                handleOpenModal()
                            }}> <MdOutlineTextFields size={26} /></Button>
                        </>
                    }
                </div>
            </>
            }

            {IsTextBlockDragging && <>
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