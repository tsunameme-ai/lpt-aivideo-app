'use client'
import { useEffect, useRef, useState } from "react";
import TextBlock, { TextBlockProps } from "./text-block";
import { Stage, Layer } from "react-konva";
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { Button } from "@nextui-org/react";


interface EditorProps {
    width: number,
    height: number
}

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const [isEditingText, setIsEditingText] = useState<boolean>(false)
    const [textBlocks, setTextBlocks] = useState<TextBlockProps[]>([{
        id: 'rect1',
        isSelected: false,
        text: "hello\nhi\nonce upon a time",
        x: 10,
        y: 10,
        // width: 100
    }, {
        id: 'rect2',
        isSelected: false,
        text: "world",
        x: 10,
        y: 10,
        // width: 100
    }])

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const checkDeselect = (e: any) => {
        // deselect when clicked on empty area
        console.log(e)
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(undefined);
            setIsEditingText(false)
        }
    };


    const quillRef = useRef(null);
    const [quillEditor, setQuillEditor] = useState<Quill>()
    const [style] = useState<{
        size: 'small' | false | 'large' | 'huge',
        bold: boolean,
        italic: boolean,
        color: string,
        background: string,
        font: false | 'serif' | 'monospace',
        align: false | 'center' | 'right',
    }>({ size: false, bold: false, italic: false, color: '#000000', background: '#ffffff', font: false, align: false })

    const handleStyleChange = (q: Quill, attribute: string, value: any) => {
        console.log(`handleStyleChange ${attribute} ${value}`)
        // const text = q.getText()
        if (attribute === 'color' && value === false) {
            value = '#000000'
        }
        (style as any)[attribute] = value
        styleQuill(q)
        // q.formatText({ index: 0, length: text.length }, { ...style })
        console.log(`quill??? ${quillEditor}`)
    }
    const styleQuill = (q: Quill) => {
        const text = q.getText()
        const keys = Object.keys(style)
        for (let key of keys) {
            q.formatText({ index: 0, length: text.length }, key, (style as any)[key])
        }
        // q.formatText({ index: 0, length: text.length }, { ...style })
    }

    useEffect(() => {
        if (quillRef.current) {
            if (!quillEditor) {
                const q = new Quill(quillRef.current, {
                    modules: {
                        toolbar: {
                            container: [
                                // [{ 'size': [] }],
                                ['bold', 'italic'],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'font': [] }],
                                [{ 'align': [false, 'center', 'right'] }],
                            ],
                            handlers: {
                                size: (value: string) => handleStyleChange(q, 'size', value),
                                bold: (value: boolean) => handleStyleChange(q, 'bold', value),
                                italic: (value: boolean) => handleStyleChange(q, 'italic', value),
                                color: (value: boolean) => handleStyleChange(q, 'color', value),
                                background: (value: boolean) => handleStyleChange(q, 'background', value),
                                font: (value: boolean) => handleStyleChange(q, 'font', value),
                                align: (value: boolean) => handleStyleChange(q, 'align', value),
                            }
                        }
                    },
                    theme: 'snow', // Use the Snow theme
                });
                q.on('text-change', () => {
                    styleQuill(q)
                })
                setQuillEditor(q)
                styleQuill(q)
                console.log(`???? setQuill ${q}`)
            }
        }
    }, []);
    // console.log(quillEditor)

    return (
        <div style={{ border: '1px solid #f00', width: `${props.width}px`, height: `${props.height}px`, position: 'relative' }} onClick={() => { checkDeselect }}>
            <Stage
                style={{ border: '1px solid #0f0', position: 'absolute', visibility: `${isEditingText ? 'hidden' : 'visible'}` }}
                width={props.width}
                height={props.height}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}>
                <Layer>
                    {textBlocks.map((rect, i) => {
                        return (
                            <TextBlock
                                key={i}
                                {...rect}
                                isSelected={rect.id === selectedId}
                                onSelect={() => {
                                    setSelectedId(rect.id);
                                }}
                                onRequestEdit={(attrs: TextBlockProps) => {
                                    setIsEditingText(true)
                                    console.log(quillEditor)
                                    quillEditor?.setText(attrs.text || '')
                                }}
                            // onChange={(newAttrs) => {
                            //     const rects = rectangles.slice();
                            //     rects[i] = newAttrs;
                            //     setRectangles(rects);
                            // }}
                            />
                        );
                    })}
                </Layer>
            </Stage>

            <div style={{ border: '1px solid #00f', position: 'absolute', visibility: `${isEditingText ? 'visible' : 'hidden'}` }}>
                <div ref={quillRef} />
                <Button onPress={() => {
                    setIsEditingText(false)
                    const tbSelected = textBlocks.find((r) => {
                        return r.id === selectedId
                    })
                    console.log(textBlocks)
                    console.log(selectedId)
                    console.log(tbSelected)
                    console.log(quillEditor?.getText())
                    if (tbSelected) {
                        tbSelected.fill = style.color
                        tbSelected.text = quillEditor?.getText()
                        // tbSelected.back
                        tbSelected.fontFamily = style.font === false ? undefined : style.font as string


                        // tbSelected.fontSize = style.size
                    }


                }}>Done</Button>
            </div>
        </div>
    );
};
export default Editor