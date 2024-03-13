import { Fragment, useEffect, useRef } from "react";
import { Label, Tag, Text, Transformer } from "react-konva";
import Konva from 'konva';

export interface TextBlockProps {
    x: number,
    y: number,
    fontFamily?: string,
    fill: string,
    text?: string,
    align?: string
    fontStyle?: string,
    background: string,
    id: string,
    isSelected: boolean,
    onSelect?: (evt: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<Event>) => void
    onRequestEdit?: (block: any) => void
}

const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
    const shapeRef = useRef<any>();
    const textRef = useRef<any>();
    const trRef = useRef<any>();

    useEffect(() => {
        if (props.isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [props.isSelected]);

    // useEffect(() => {
    //     const numLines = (props.text ?? '').split('\n').length
    //     console.log(numLines)
    //     // shapeRef.current
    //     console.log(`shapeRef size ${shapeRef.current.width()} ${shapeRef.current.height()}`)
    //     console.log(`textRef size ${textRef.current.width()} ${textRef.current.height()}`)
    //     // textRef.current.height = 50 * numLines + 40

    // }, [props.text, props.background, props.fill])

    const onDoubleClick = () => {
        props.onRequestEdit?.(props)
    }

    return (
        <Fragment>
            <Label
                ref={shapeRef}
                draggable
            >
                <Tag
                    cornerRadius={10}
                    fill={props.background}
                    opacity={0.5}
                />
                <Text
                    lineHeight={1}
                    padding={20}
                    fontSize={50}
                    ref={textRef}
                    fontFamily={props.fontFamily}
                    fill={props.fill}
                    text={props.text}
                    fontStyle={props.fontStyle}
                    align={props.align}
                    onClick={props.onSelect}
                    onTap={props.onSelect}
                    onDblClick={onDoubleClick}
                    onDblTap={onDoubleClick}
                />
            </Label>
            {props.isSelected && (
                <Transformer
                    ref={trRef}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'bottom-right']}
                    // enabledAnchors={['middle-left', 'middle-right']}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        newBox.width = Math.max(40, newBox.width)
                        newBox.height = Math.max(90, newBox.height)
                        return newBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default TextBlock