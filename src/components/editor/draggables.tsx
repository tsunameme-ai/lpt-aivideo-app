import { useState } from "react";
import { Stage, Layer, Text } from "react-konva";


const Draggables = () => {
    // console.log(`${window.innerWidth} ${window.innerHeight}`)


    function generateShapes() {
        return [...Array(10)].map((_, i) => ({
            id: i.toString(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotation: Math.random() * 180,
            isDragging: false,
        }));
    }

    const INITIAL_STATE = generateShapes()

    const [stars, setStars] = useState(INITIAL_STATE)

    const handleDragStart = (e) => {
        console.log(e)
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };
    const handleDragEnd = (e: any) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} style={{ border: '1px solid #f00' }}>
            <Layer>
                <Text text="Try to drag a star" />
                {stars.map((star) => (
                    <Text
                        style={{ border: '1px solid #f00' }}
                        text={`text ${star.id}`}
                        key={star.id}
                        id={star.id}
                        x={star.x}
                        y={star.y}
                        fill="#000000"
                        opacity={0.8}
                        draggable
                        rotation={star.rotation}
                        shadowColor="black"
                        // shadowBlur={10}
                        // shadowOpacity={0.2}
                        // shadowOffsetX={star.isDragging ? 10 : 5}
                        // shadowOffsetY={star.isDragging ? 10 : 5}
                        scaleX={star.isDragging ? 1.2 : 1}
                        scaleY={star.isDragging ? 1.2 : 1}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </Layer>
        </Stage>
    );
};
export default Draggables