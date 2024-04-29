import { Vector2d } from "konva/lib/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Label, Tag, Text, Transformer } from "react-konva";
import { preventEventDefault } from "./utils";

export interface TextBlockProps {
    x: number,
    y: number,
    stageWidth: number,
    stageHeight: number,
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
    onDragging?: (x: number, y: number) => void
    onDragStart?: () => void
    onDragEnd?: (x: number, y: number) => void
}

const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
    const shapeRef = useRef<any>()
    const textRef = useRef<any>()
    const trRef = useRef<any>()
    const tagRef = useRef<any>()
    const [centerOffset, setCenterOffset] = useState<Vector2d>({ x: 0, y: 0 })

    useEffect(() => {
        if (props.isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [props.isSelected])

    useEffect(() => {
        if (props.stageWidth) {
            if (textRef.current.getWidth() > props.stageWidth - 10) {
                textRef.current.setWidth(props.stageWidth - 10)
            }
            trRef.current?.forceUpdate()
        }
    }, [props.text])


    useEffect(() => {
        trRef.current?.forceUpdate()
    }, [props.isSelected])

    useEffect(() => {
        if (props.stageWidth && props.stageHeight) {
            shapeRef.current.setAttrs({
                x: (props.stageWidth - textRef.current.getWidth()) * 0.5,
                y: (props.stageHeight - textRef.current.getHeight()) * 0.5
            });
            setCenterOffset({ x: textRef.current.getWidth() * .5, y: textRef.current.getHeight() * .5 })
        }
    }, [])

    const onClick = () => {
        props.onRequestEdit?.(props)
    }

    const onHandleBound = (pos: Vector2d) => {
        const w = trRef.current.getWidth()
        const h = trRef.current.getHeight()
        const r = trRef.current.getRotation() * Math.PI / 180

        const cw = w * .5 * Math.cos(r) - h * .5 * Math.sin(r)
        const ch = w * .5 * Math.sin(r) + h * .5 * Math.cos(r)
        setCenterOffset({ x: cw, y: ch })

        const maxX = props.stageWidth - cw
        const maxY = props.stageHeight - ch

        const minX = -cw
        const minY = -ch
        const x = Math.max(Math.min(pos.x, maxX), minX)
        const y = Math.max(Math.min(pos.y, maxY), minY)
        return { x, y }
    }
    return (
        <Fragment>
            <Label
                ref={shapeRef}
                // draggable
                draggable={props.isSelected}
                onClick={() => { props.onSelect?.(props.id) }}
                onTap={() => { props.onSelect?.(props.id) }}
                dragBoundFunc={onHandleBound}
            >
                <Tag
                    ref={tagRef}
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
                    wrap='words'
                />
            </Label>
            {
                props.isSelected && (
                    <Transformer
                        ref={trRef}
                        keepRatio={true}
                        rotationSnaps={[0, 90, 180]}
                        rotateAnchorOffset={50}
                        anchorCornerRadius={10}
                        anchorSize={20}
                        anchorFill='#F2ECDC'
                        anchorStroke='#016283'
                        anchorStrokeWidth={2}
                        borderStrokeWidth={2}
                        borderStroke='#016283'
                        enabledAnchors={['bottom-right']}
                        flipEnabled={false}
                        centeredScaling
                        onDragStart={(e) => {
                            preventEventDefault(e)
                            props.onDragStart?.()
                        }}
                        onDragMove={(e) => {
                            preventEventDefault(e)
                            props.onDragging?.(centerOffset.x + trRef.current.getX(), centerOffset.y + trRef.current.getY())
                        }}
                        onDragEnd={(e) => {
                            preventEventDefault(e)
                            props.onDragEnd?.(centerOffset.x + trRef.current.getX(), centerOffset.y + trRef.current.getY())
                        }}
                        boundBoxFunc={(_, newBox) => {
                            newBox.width = Math.max(20, newBox.width)
                            newBox.height = Math.max(20, newBox.height)
                            return newBox
                        }}
                    />
                )
            }
        </Fragment >
    );
};

export default TextBlock