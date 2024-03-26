import { Fragment, useEffect, useRef } from "react";
import { Label, Tag, Text, Transformer } from "react-konva";

export interface TextBlockProps {
    x: number,
    y: number,
    blockWidth: number,
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
    onDragging?: (e: any) => void
    onDragStart?: (e: any) => void
    onDragEnd?: (e: any) => void
}

const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
    const shapeRef = useRef<any>()
    const textRef = useRef<any>()
    const trRef = useRef<any>()

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

    const onClick = () => {
        props.onRequestEdit?.(props)
    }

    return (
        <Fragment>
            <Label
                ref={shapeRef}
                draggable
                onClick={() => { props.onSelect?.(props.id) }}
                onTap={() => { props.onSelect?.(props.id) }}
                onMouseDown={() => { props.onSelect?.(props.id) }}
                onDragStart={(e) => { props.onDragStart?.(e) }}
                onDragMove={(e) => { props.onDragging?.(e) }}
                onDragEnd={(e) => { props.onDragEnd?.(e) }}
            >
                <Tag
                    cornerRadius={0}
                    fill={props.background}
                    opacity={props.opacity ?? 0.5}
                />
                <Text
                    width={props.blockWidth}
                    lineHeight={1}
                    padding={10}
                    fontSize={22}
                    ref={textRef}
                    fontFamily={props.fontFamily}
                    fill={props.fill}
                    text={props.text}
                    fontStyle={props.fontStyle}
                    align={props.align}
                    onClick={onClick}
                    onTap={onClick}
                    wrap='word'
                />
            </Label>
            {props.isSelected && (
                <Transformer
                    ref={trRef}
                    keepRatio={true}
                    rotationSnaps={[0, 90, 180]}
                    rotateAnchorOffset={30}
                    anchorCornerRadius={5}
                    enabledAnchors={['top-left', 'bottom-right']}
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