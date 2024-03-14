import { Fragment, useEffect, useRef } from "react";
import { Label, Tag, Text, Transformer } from "react-konva";
// import Konva from 'konva';

export interface TextBlockProps {
    x: number,
    y: number,
    fontFamily?: string,
    fill: string,
    text?: string,
    align?: string
    fontStyle?: string,
    opacity?: number
    background: string,
    id: string,
    isSelected: boolean,
    onSelect?: (id: string) => void
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

    //A hack to fix transfer outline is off
    useEffect(() => {
        shapeRef.current.fire('click')

    }, [props.text])

    const onDoubleClick = () => {
        props.onRequestEdit?.(props)
    }

    return (
        <Fragment>
            <Label
                ref={shapeRef}
                draggable
                onClick={() => { props.onSelect?.(props.id) }}
                onTap={() => { props.onSelect?.(props.id) }}
            >
                <Tag
                    cornerRadius={10}
                    fill={props.background}
                    opacity={props.opacity ?? 0.5}
                />
                <Text
                    lineHeight={1}
                    padding={20}
                    fontSize={32}
                    ref={textRef}
                    fontFamily={props.fontFamily}
                    fill={props.fill}
                    text={props.text}
                    fontStyle={props.fontStyle}
                    align={props.align}
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
                    boundBoxFunc={(_, newBox) => {
                        newBox.width = Math.max(20, newBox.width)
                        newBox.height = Math.max(20, newBox.height)
                        return newBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default TextBlock