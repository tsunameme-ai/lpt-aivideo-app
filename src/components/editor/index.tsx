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

    const initialRectangles = [
        {
            text: "hello\nhi\nonce upon a time",
            x: 10,
            y: 10,
            width: 100,
            // height: 100,
            fill: 'red',
            id: 'rect1',
        },
        {
            text: "world",
            x: 150,
            y: 150,
            width: 100,
            // height: 100,
            fill: 'green',
            id: 'rect2',
        },
    ];
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
                const fontSizeArr = ['8px', '10px', '14px', '20px', '32px', '54px', '68px', '84px', '98px'];

                const Size: any = Quill.import('attributors/style/size');
                Size.whitelist = fontSizeArr;
                Quill.register(Size, true);

                const q = new Quill(quillRef.current, {
                    modules: {
                        toolbar: {
                            container: [
                                // [{ 'size': [] }],
                                [{ 'size': fontSizeArr }],
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
                q.setText(initialRectangles[0].text)
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
                    {initialRectangles.map((rect, i) => {
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
                                    // style.size = attrs.fontSize
                                    // style.
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
                <div ref={quillRef} /> {/* Ref for Quill container */}
                <Button onPress={() => {
                    setIsEditingText(false)

                }}>Done</Button>
            </div>
        </div>
    );
};
export default Editor