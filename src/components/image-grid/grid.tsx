import { GenerationRequest } from '@/libs/types';
import { Image } from "@nextui-org/react"


interface GridProps {
    items: GenerationRequest[]
    onClickItem?: (item: GenerationRequest) => void
}

const ImageGrid: React.FC<GridProps> = (props: GridProps) => {
    return (
        <div className="grid grid-cols-2 gap-1">
            {props.items.map((item, index) => (
                <div key={index}>
                    <Image radius="sm" loading='lazy' src={item.outputs?.[0].url!} alt={item.outputs?.[0].url!} onClick={() => { props.onClickItem?.(item) }} />
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;