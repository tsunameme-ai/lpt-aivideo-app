import { useEffect, useRef, useState } from "react";
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { Button } from "@nextui-org/react";

export interface TextEditorProps {
    text: string
    color?: string,
    background?: string,
    onEditingEnd?: (text: string | undefined, style: any) => void
}

const TextEditor: React.FC<TextEditorProps> = (props: TextEditorProps) => {
    const quillRef = useRef(null);
    const [quillEditor, setQuillEditor] = useState<Quill>()
    const [style] = useState<{
        size: 'small' | false | 'large' | 'huge',
        bold: boolean,
        italic: boolean,
        color?: string,
        background?: string,
        font: false | 'serif' | 'monospace',
        align: false | 'center' | 'right',
    }>({ size: 'huge', bold: false, italic: false, color: '#000000', background: '#ffffff', font: false, align: false })

    const handleStyleChange = (q: Quill, attribute: string, value: any) => {
        if (attribute === 'color' && value === false) {
            value = '#000000'
        }
        (style as any)[attribute] = value
        styleQuill(q)
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
                                [{ 'align': [false, 'center', 'right'] }]
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
                    placeholder: 'Write your creative copies here. The text can be multiple lines.',
                    theme: 'snow',
                });
                q.format('size', style.size)
                q.on('text-change', () => {
                    styleQuill(q)
                })
                q.setText(props.text || '')
                setQuillEditor(q)
                styleQuill(q)
                q.focus()
            }
        }
        quillEditor?.focus()
    }, []);
    useEffect(() => {
        quillEditor?.setText(props.text || '')
        style.color = props.color
        style.background = props.background

    }, [props.text, props.color, props.background])


    return (
        <>
            <div ref={quillRef} />
            <Button onPress={() => {
                props.onEditingEnd?.(quillEditor?.getText().trim(), style)
            }}>Done</Button>
        </>
    )
}
export default TextEditor