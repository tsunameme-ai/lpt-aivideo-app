import { GenerationRequest } from '@/libs/types';
import { Image } from "@nextui-org/react"


interface ImageGridProps {
    items: GenerationRequest[]
    onClickItem?: (url: string) => void
}

const ImageGrid: React.FC<ImageGridProps> = (props: ImageGridProps) => {
    return (
        <div className="grid grid-cols-2 gap-1">
            {props.items.map((item, index) => (
                <div key={index}>
                    <Image radius="sm" loading='lazy' src={item.outputs?.[0].url!} alt={item.outputs?.[0].url!} onClick={() => { props.onClickItem?.(item.outputs?.[0].url!) }} />
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;