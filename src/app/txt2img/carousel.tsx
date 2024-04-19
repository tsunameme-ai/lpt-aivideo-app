import { GenerationOutputItem } from "@/libs/types"
import { Spacer, Image } from '@nextui-org/react'
import styles from '@/styles/home.module.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef } from "react";

interface CarouselProps {
    imageOutputs: GenerationOutputItem[]
    selectedOutputIndex: number
    onImageOutputSelected: (value: number) => void
}
const Carousel: React.FC<CarouselProps> = ({ imageOutputs, selectedOutputIndex, onImageOutputSelected }) => {
    const sliderRef = useRef<any>(undefined);
    useEffect(() => {
        if (sliderRef) {
            sliderRef.current?.slickGoTo(selectedOutputIndex, selectedOutputIndex === 0)
        }

    }, [selectedOutputIndex])
    return (
        <>
            {imageOutputs.length == 1 && <>
                <Image className={styles.center} src={imageOutputs[0].url} alt={imageOutputs[0].url} />
                <Spacer y={9} />
            </>}

            {imageOutputs.length > 1 && <>
                <Slider ref={sliderRef} className={styles.slider} arrows={false} dots={true} slidesToShow={1} slidesToScroll={1} vertical={false}
                    initialSlide={selectedOutputIndex}
                    afterChange={onImageOutputSelected}>
                    {imageOutputs.map((item: GenerationOutputItem, key: number) => (
                        <div key={key} >
                            <Image className={styles.center} src={item.url} alt={item.seed?.toString()} />
                        </div>
                    ))}
                </Slider>
                <Spacer y={9} />
            </>}
        </>
    )
}
export default Carousel