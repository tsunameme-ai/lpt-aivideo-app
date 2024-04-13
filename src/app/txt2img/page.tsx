'use client'
import { useRouter } from 'next/navigation'
import { Button, Spacer, Image } from '@nextui-org/react'
import { GenerationOutputItem } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import { useState } from 'react'
import styles from '@/styles/home.module.css'
import React from 'react'
import { useGenerationContext } from '@/context/generation-context'
import AdvancedIndicator from '@/components/advanced-indicator'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { appFont } from '../fonts'


export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [imageOutputs, setImageOutputs] = useState<Array<GenerationOutputItem>>(gContext.t2iOutputs)
    const [selectedOutputIndex, setSeelectedOutputIndex] = useState<number>(gContext.t2iOutputSelectedIndex)
    const showAdvIndicator = process.env.NEXT_PUBLIC_ADV_IND === "on"

    const onImagesGenerated = (outputs: Array<GenerationOutputItem>) => {
        setImageOutputs(outputs)
    }
    const onImagesError = () => {
        setImageOutputs([])
    }

    const onImageOutputSelected = (value: number) => {
        setSeelectedOutputIndex(value)
    }

    const handleClickNext = () => {
        gContext.setT2iOutputSelectedIndex(selectedOutputIndex)
        router.push('/add-text')
    }
    return (
        <>
            <section className={`${styles.main} ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div>Step 1 of 3: Write the prompt &nbsp; &nbsp; {showAdvIndicator && <AdvancedIndicator />} </div>
                    <Spacer y={2} />
                    <Txt2ImgComponent
                        isAdvancedView={gContext.isAdvancedView}
                        onImagesGenerated={onImagesGenerated}
                        onImagesError={onImagesError} />
                    <Spacer y={2} />

                    {imageOutputs.length == 1 && <>
                        <Image className={styles.center} src={imageOutputs[0].url} alt={imageOutputs[0].url} />
                        <Spacer y={9} />
                    </>}

                    {imageOutputs.length > 1 && <>
                        <Slider className={styles.slider} dots={true} slidesToShow={1} slidesToScroll={1} vertical={false}
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
                </div>
                {imageOutputs.length > 0 && <>
                    <div className={styles.centerSection}>
                        <Button size='lg' className='w-full' color='primary' radius='sm' onPress={handleClickNext}>Next</Button>
                    </div>
                </>}
            </section >
        </>
    )
}