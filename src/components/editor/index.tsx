'use client'
import { useEffect, useState } from "react"
import TextBlock, { TextBlockProps } from "./text-block"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
//import "quill/dist/quill.snow.css";
import { Button, Spinner, useDisclosure } from "@nextui-org/react"
import RemoteImage from "../remote-image"
import { SDAPI } from "@/libs/sd-api"
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH } from "@/libs/types"
import EditTextModalComponent from "@/components/edit-text-modal"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdOutlineTextFields } from "react-icons/md"
import { FaFileDownload } from "react-icons/fa"
import styles from "@/styles/home.module.css"

interface EditorProps {
    coverLayerRef?: any
    stageRef?: any
    imageUrl: string
    onPixelRatio?: (ratio: number, width: number, height: number) => void
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    //let isDragging: boolean = false
    const [image, setImage] = useState<HTMLImageElement>()
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [, setPixelRatio] = useState<number>(1.0)
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [IsTextBlockDragging, setIsTextBlockDragging] = useState<boolean>(false)
    const handleMouseDown = (e: any) => {
        console.log('handleMouseDown')
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
        console.log(height)
        console.log(editorH)
        console.log(imgHeight)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpenModal = () => { onOpen() }
    const handleCloseModal = (text: string, slider: number) => {
        const key = `rect${Object.keys(textBlocks).length}`
        Object.keys(textBlocks).forEach(key => {
            delete textBlocks[key]
        })

        const editorWrapperElement = document.getElementById('editor-wrapper')
        const editorW = editorWrapperElement?.clientWidth ?? 330

        textBlocks[key] = {
            blockWidth: editorW * 0.99,
            id: key,
            isSelected: false,
            text: text,
            opacity: slider,
            fill: 'black',
            background: 'white',
            x: 15,
            y: 15
        }
        onClose()
    }

    const handleTextBlockDragging = (e: any) => {
        console.log(IsTextBlockDragging)
        if (!height || !width)
            return

        if (width && Math.abs(e.target.attrs.x) >= (width - 1)) {
            console.log('delete')
            if (selectedId) {
                delete textBlocks[selectedId]
                setSelectedId(undefined)
                toast.warning("Text deleted", {
                    toastId: 'delete notification',
                    autoClose: 1500,
                    hideProgressBar: true
                })
            }
        } else
            console.log(`target.attr: ${e.target.attrs.x}, ${e.target.attrs.y}`)
        //console.log('evt.touches: ' + e.evt.touches[0].clientX + ',' + e.evt.touches[0].clientY)
    }

    useEffect(() => {
        const onResize = () => {
            resize(image)
        }
        onResize()
        window.addEventListener('resize', onResize)
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
                                                    setIsTextBlockDragging(true)
                                                    console.log('start')
                                                    e
                                                }}
                                                onDragEnd={(e) => {
                                                    setIsTextBlockDragging(false)
                                                    console.log('end')
                                                    e
                                                }}
                                            />
                                        );
                                    })}
                            </Layer>
                        </Stage>
                    </div >
                </> : <Spinner />}
            </div>

            {!IsTextBlockDragging && <>
                <div className="max-w">
                    <Button isIconOnly variant="light" className={styles.addTextBtn} onPress={() => {
                    }}> <FaFileDownload size={20} /></Button>
                    <Button isIconOnly variant="light" className={styles.addTextBtn} onPress={() => {
                        handleOpenModal()
                    }}> <MdOutlineTextFields size={26} /></Button>
                </div>
            </>
            }
        </>
    );
};
export default Editor