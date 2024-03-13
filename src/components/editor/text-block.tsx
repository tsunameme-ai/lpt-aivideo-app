import { Fragment, useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";
import Konva from 'konva';

export interface TextBlockProps extends Konva.TextConfig {
    id: string,
    isSelected: boolean,
    onSelect?: (evt: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<Event>) => void
    onRequestEdit?: (block: any) => void
}

const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
    const shapeRef = useRef<any>();
    const trRef = useRef<any>();

    useEffect(() => {
        if (props.isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [props.isSelected]);

    const onDoubleClick = (evt: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<Event>) => {
        console.log(`DOUBLE CLICK`)
        console.log(evt.target)
        props.onRequestEdit?.(evt.target.attrs as TextBlockProps)
    }

    return (
        <Fragment>
            <Text
                ref={shapeRef}
                draggable
                fontSize={50}
                onClick={props.onSelect}
                onTap={props.onSelect}
                onDblClick={onDoubleClick}
                onDblTap={onDoubleClick}
                {...props}
            />
            {props.isSelected && (
                <Transformer
                    ref={trRef}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    // enabledAnchors={['middle-left', 'middle-right']}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize

                        newBox.width = Math.max(30, newBox.width);
                        newBox.height = Math.max(10, newBox.height)
                        console.log(newBox)
                        return newBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default TextBlock