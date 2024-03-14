'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import TextBlock, { TextBlockProps } from "./text-block";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import "quill/dist/quill.snow.css";
import { Button, Slider } from "@nextui-org/react";
import TextEditor, { TextEditorProps } from "./text-editor";
import Konva from 'konva'
import RemoteImage from "../remote-image";
interface EditorProps {
    imageUrl: string
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    // const stageRef = useRef<{ current: LegacyRef<Stage> }>();
    const stageRef = useRef<{ current: typeof Stage }>();
    const layerRef = useRef<any>();
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [isEditingText, setIsEditingText] = useState<boolean>(false)
    const [textEditorAttrs, setTextEditorAttrs] = useState<TextEditorProps>({
        text: '',
        color: '#000000',
        background: '#ffffff'
    })
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const checkDeselect = (e: any) => {
        console.log(e.target instanceof (Text))
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(undefined);
            setIsEditingText(false)
        }
    };


    //Force update applies when a text block is selected, opacity update is not sent to the object
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const onResize = (img?: any) => {
        let editorW = window.innerWidth
        let editorH = window.innerHeight
        const navigationElement = document.getElementById('app-nav');
        const containerElement = document.getElementById('editor-container');
        editorW -= (containerElement?.offsetLeft ?? 0) * 2
        editorH -= navigationElement?.offsetHeight ?? 0
        editorH -= (containerElement?.offsetLeft ?? 0)
        if (img) {
            editorW = Math.min(editorW, img.width)
            editorH = editorW / img.width * img.height

        }
        setWidth(editorW)
        setHeight(editorH)
        console.log(`??? onResize ${editorW} ${editorH}`)
    }

    useEffect(() => {
        onResize()
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [])

    const [image, setImage] = useState<any>()

    return (
        <>
            <div id='editor-container' style={{ border: '1px solid #f00', width: `${width}px`, height: `${height}px`, position: 'relative', padding: '0px', margin: '0px' }} onClick={() => { checkDeselect }}>
                <RemoteImage src={props.imageUrl} onComplete={(imgLocalUrl) => {
                    console.log('???? onComplete')
                    console.log(imgLocalUrl)
                    const img = new Image();
                    img.onload = () => {
                        setImage(img)
                        onResize(img)
                    };
                    img.src = imgLocalUrl
                }} />
                {image && <Stage
                    ref={stageRef as any}
                    style={{ border: '1px solid #0f0', position: 'absolute', visibility: `${isEditingText ? 'hidden' : 'visible'}` }}
                    width={width}
                    height={height}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}>
                    <Layer>
                        <KonvaImage listening={false} x={0} y={0} width={width} height={height} image={image} />
                    </Layer>
                    <Layer
                        ref={layerRef}>
                        {/* {image &&
                            <KonvaImage x={0} y={0} width={width} height={height} image={image} />} */}
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
                }

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


            <div style={{ width: '100%', padding: '0px', margin: '0px' }}>
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
                    console.log('??? download')
                    console.log(layerRef.current.getLayer())
                    const hc = layerRef.current.getLayer().getHitCanvas()
                    console.log(hc)

                    // const dataUrl = layerRef.current.getLayer().hitCanvas.toDataURL()
                    // const s:Stage = stageRef.current
                    // stageRef.current.getLayer().batchDraw();
                    // const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 })
                    const dataUrl = layerRef.current?.toDataURL({ pixelRatio: 2 });
                    console.log(dataUrl)



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
                    }}>Remove Text</Button>
                    <Slider
                        size='sm'
                        label="Background alpha"
                        step={0.01}
                        maxValue={1}
                        minValue={0}
                        // defaultValue={0.5}
                        defaultValue={textBlocks[selectedId].opacity || 0.5}
                        classNames={{
                            base: "max-w-md gap-3",
                            track: "border-s-secondary-100",
                            filler: "bg-gradient-to-r from-secondary-100 to-secondary-500"
                        }}
                        onChange={(value) => {
                            const tbSelected = textBlocks[selectedId]
                            tbSelected.opacity = value as number
                            forceUpdate()
                        }}
                    />
                </>}
            </div>
        </>
    );
};
export default Editor