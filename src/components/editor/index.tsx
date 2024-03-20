'use client'
import { useCallback, useEffect, useState } from "react";
import TextBlock, { TextBlockProps } from "./text-block";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import "quill/dist/quill.snow.css";
import { Button, Slider, Spinner, Tooltip, useDisclosure } from "@nextui-org/react";
import TextEditor, { TextEditorProps } from "./text-editor";
import RemoteImage from "../remote-image";
import { SDAPI } from "@/libs/sd-api";
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH } from "@/libs/types";
import EditTextModalComponent from "@/components/edit-text-modal"

interface EditorProps {
    coverLayerRef?: any
    stageRef?: any
    imageUrl: string
    onPixelRatio?: (ratio: number, width: number, height: number) => void
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const [image, setImage] = useState<HTMLImageElement>()
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [, setPixelRatio] = useState<number>(1.0)
    const [isEditingText, setIsEditingText] = useState<boolean>(false)
    const [textEditorAttrs, setTextEditorAttrs] = useState<TextEditorProps>({
        text: '',
        color: '#000000',
        background: '#ffffff'
    })
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const checkDeselect = (e: any) => {
        try {
            e.preventDefault()
        }
        catch (e) {

        }
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(undefined);
            setIsEditingText(false)
        }
    };


    //Force update applies when a text block is selected, opacity update is not sent to the object
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);

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
    }
    // const onTouch = (event: any) => {
    //     const clickedCanvas = event.target.closest("canvas")
    //     if (!clickedCanvas) {
    //         setSelectedId(undefined);
    //         setIsEditingText(false)
    //     }
    // }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpenModal = () => {
        console.log('onOpen')
        onOpen()
    }

    const handleCloseModal = (v: string) => {
        console.log('v:' + v)
        onClose()
    }

    useEffect(() => {
        const onResize = () => {
            resize(image)
        }
        onResize()
        window.addEventListener('resize', onResize);
        // window.addEventListener('mousedown', onTouch);
        // window.addEventListener('touchstart', onTouch);
        return () => {
            window.removeEventListener('resize', onResize);
            // window.removeEventListener('mousedown', onTouch);
            // window.removeEventListener('touchstart', onTouch);
        };
    }, [])


    return (
        <>
            <RemoteImage src={props.imageUrl} onComplete={(imgLocalUrl) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img)
                    resize(img)
                };
                img.src = imgLocalUrl
            }} />
            <EditTextModalComponent initialText='something something' isOpen={isOpen} onClose={handleCloseModal} />
            <div id='editor-wrapper' style={{ width: '100%', border: '2px solid #ff0' }}>
                {image ? <>
                    <div id='editor-container' style={{ border: '1px solid #f00', width: '100%', height: `${height}px`, position: 'relative', padding: '0px', margin: '0px' }}>

                        <Stage
                            ref={props.stageRef}
                            style={{ border: '1px solid #0f0', position: 'absolute', visibility: `${isEditingText ? 'hidden' : 'visible'}` }}
                            width={width}
                            height={height}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}>
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
                                                    setSelectedId(rid);
                                                }}
                                                onRequestEdit={(attrs: TextBlockProps) => {
                                                    setIsEditingText(true)
                                                    setTextEditorAttrs({
                                                        text: attrs.text || '',
                                                        color: attrs.fill,
                                                        background: attrs.background
                                                    })
                                                }}
                                            />
                                        );
                                    })}
                            </Layer>
                        </Stage>

                        {textEditorAttrs && isEditingText && <div style={{ border: '1px solid #00f', position: 'absolute', width: '100%' }}>
                            <TextEditor
                                {...textEditorAttrs}
                                onEditingEnd={(text: string | undefined, style: any) => {
                                    setIsEditingText(false)
                                    if (selectedId) {
                                        if (text === undefined || text.length === 0) {
                                            delete textBlocks[selectedId]
                                        }
                                        else {
                                            const tbSelected = textBlocks[selectedId]
                                            tbSelected.fill = style.color
                                            tbSelected.text = text
                                            tbSelected.background = style.background
                                            tbSelected.fontFamily = style.font === false ? undefined : style.font as string
                                            tbSelected.fontStyle = style.bold ? 'bold' : undefined
                                            tbSelected.align = style.align === false ? undefined : style.align
                                        }
                                    }
                                    setSelectedId(undefined)
                                }}
                            />
                        </div>}

                    </div >

                    <div className="max-w">

                        <Button color='secondary' onPress={() => {
                            handleOpenModal()
                        }}> launch modal test</Button>

                        <Button onPress={() => {
                            const key = `rect${Object.keys(textBlocks).length}`
                            textBlocks[key] = {
                                id: key,
                                isSelected: false,
                                text: '',
                                fill: 'black',
                                background: 'white',
                                x: 10,
                                y: 10
                            }
                            setSelectedId(key)
                            setTextEditorAttrs({
                                text: '',
                                color: 'black',
                                background: 'white',
                            })
                            setIsEditingText(true)
                        }}>Add Text</Button>
                        <Button onPress={() => {
                            if (!props.stageRef) {
                                console.log(`stageRef is not defined!`)
                                return
                            }
                            // const dataUrl = props.stageRef.current?.toDataURL({ pixelRatio: pixelRatio });
                            const dataUrl = props.stageRef.current?.toDataURL({ pixelRatio: 2 });
                            const link = document.createElement("a");
                            link.href = dataUrl;
                            link.download = "image.png";
                            link.click();
                        }}>
                            Dowload Image
                        </Button>

                        {selectedId && !isEditingText && <>
                            <Button onPress={() => {
                                delete textBlocks[selectedId]
                                setSelectedId(undefined)
                            }}>Remove</Button>
                            <Tooltip
                                content={
                                    <Slider
                                        className="h-32"
                                        aria-label="background opacity"
                                        size='sm'
                                        step={0.01}
                                        maxValue={1}
                                        minValue={0}
                                        orientation="vertical"
                                        defaultValue={textBlocks[selectedId].opacity || 0.5}
                                        onChange={(value) => {
                                            const tbSelected = textBlocks[selectedId]
                                            tbSelected.opacity = value as number
                                            forceUpdate()
                                        }}
                                    />}
                            >
                                <Button>Background Opacity</Button>
                            </Tooltip>
                        </>}
                    </div>
                </> : <Spinner />}
            </div >
        </>
    );
};
export default Editor