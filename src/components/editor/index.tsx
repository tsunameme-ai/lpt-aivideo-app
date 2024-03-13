'use client'
import { useCallback, useRef, useState } from "react";
import TextBlock, { TextBlockProps } from "./text-block";
import { Stage, Layer } from "react-konva";
import "quill/dist/quill.snow.css";
import { Button, Slider } from "@nextui-org/react";
import TextEditor, { TextEditorProps } from "./text-editor";

interface EditorProps {
    width: number,
    height: number
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const layerRef = useRef<any>();
    const [isEditingText, setIsEditingText] = useState<boolean>(false)
    const [textEditorAttrs, setTextEditorAttrs] = useState<TextEditorProps>({
        text: '',
        color: '#000000',
        background: '#ffffff'
    })
    const [textBlocks] = useState<{ [key: string]: TextBlockProps }>({})

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const checkDeselect = (e: any) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(undefined);
            setIsEditingText(false)
        }
    };


    //Force update applies when a text block is selected, opacity update is not sent to the object
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);

    return (
        <>
            <div style={{ border: '1px solid #f00', width: `${props.width}px`, height: `${props.height}px`, position: 'relative' }} onClick={() => { checkDeselect }}>
                <Stage
                    style={{ border: '1px solid #0f0', position: 'absolute', visibility: `${isEditingText ? 'hidden' : 'visible'}` }}
                    width={props.width}
                    height={props.height}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}>
                    <Layer ref={layerRef}>
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

                <div style={{ border: '1px solid #00f', position: 'absolute', width: '100%', visibility: `${isEditingText ? 'visible' : 'hidden'}` }}>
                    {textEditorAttrs && <TextEditor
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
                    />}
                </div>
            </div>
            <div>
                <Button onPress={() => {
                    setIsEditingText(true)
                    setTextEditorAttrs({
                        text: '',
                        color: 'black',
                        background: 'white',
                    })
                    const key = `rect${Object.keys(textBlocks).length}`
                    setSelectedId(key)
                    textBlocks[key] = {
                        id: key,
                        isSelected: false,
                        text: "Your Text",
                        fill: 'black',
                        background: 'white',
                        x: 10,
                        y: 10
                    }

                }}>Add Text</Button>

                {selectedId && <>
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