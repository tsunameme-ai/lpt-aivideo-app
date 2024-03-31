import { Vector2d } from "konva/lib/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Label, Tag, Text, Transformer } from "react-konva";

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
    onDragging?: (e: any) => void
    onDragStart?: (e: any) => void
    onDragEnd?: (e: any) => void
    //onHandleBound?: (p: Vector2d) => Vector2d
}

const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
    const shapeRef = useRef<any>()
    const textRef = useRef<any>()
    const trRef = useRef<any>()
    const [blockWidth, setBlockWidth] = useState<number>(100)
    const [blockHeight, setBlockHeight] = useState<number>(20)
    const DRAG_BOUND_X = 329
    const DRAG_BOUND_Y = 329

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

    const onHandleBound = (pos: Vector2d) => {
        //console.log(pos)
        //console.log(blockWidth)
        if (pos.x >= DRAG_BOUND_X)
            return { x: DRAG_BOUND_X, y: pos.y }

        if (pos.y >= DRAG_BOUND_Y)
            return { x: pos.x, y: DRAG_BOUND_Y }


        if (blockWidth > 0 && pos.x <= (blockWidth * -1) * 0.92)
            return {
                x: (blockWidth * -1) * 0.92,
                y: pos.y
            }

        if (blockHeight > 0 && pos.y <= (blockHeight * -1) * 0.92)
            return {
                x: pos.x,
                y: (blockHeight * -1) * 0.92
            }

        return { x: pos.x, y: pos.y }
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
                dragBoundFunc={onHandleBound}
            >
                <Tag
                    cornerRadius={0}
                    fill={props.background}
                    opacity={props.opacity ?? 0.5}
                />
                <Text
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
                        setBlockWidth(newBox.width)
                        setBlockHeight(newBox.height)
                        return newBox
                    }}
                />
            )}
        </Fragment>
    );
};

export default TextBlock