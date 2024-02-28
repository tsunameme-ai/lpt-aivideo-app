'use client'
import { useRouter } from 'next/navigation'
import { Button, Spacer, Image } from '@nextui-org/react'
import { GenerationOutput, SDProvider } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import getSDProvider from '@/libs/sd-provider'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.css'
import React from 'react'
import { useGenerationContext } from '@/context/generation-context'
import AdvancedIndicator from '@/components/advanced-indicator'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [sdProvider, setSdProvider] = useState<SDProvider>()
    const [imageOutputs, setImageOutputs] = useState<Array<GenerationOutput>>(gContext.t2iOutputs)
    const [selectedOutputIndex, setSeelectedOutputIndex] = useState<number>(gContext.t2iOutputSelectedIndex)
    const showAdvIndicator = process.env.NEXT_PUBLIC_ADV_IND === "on"

    useEffect(() => {
        const sdProvider = getSDProvider()
        setSdProvider(sdProvider)
    }, [])

    const onImagesGenerated = (outputs: Array<GenerationOutput>) => {
        setImageOutputs(outputs)
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
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <div>Step 1: Write prompt &nbsp; &nbsp; {showAdvIndicator && <AdvancedIndicator />} </div>
                    <Spacer y={2} />
                    {sdProvider && <Txt2ImgComponent
                        sdProvider={sdProvider}
                        isAdvancedView={gContext.isAdvancedView}
                        onImagesGenerated={onImagesGenerated}
                    />}
                    <Spacer y={2} />

                    {imageOutputs.length == 1 && <>
                        <Image className={styles.center} src={imageOutputs[0].mediaUrl} alt={imageOutputs[0].mediaUrl} />
                        <Spacer y={8} />
                    </>}

                    {imageOutputs.length > 1 && <>
                        <Slider className={styles.slider} dots={true} slidesToShow={1} slidesToScroll={1} vertical={false} afterChange={onImageOutputSelected}>
                            {imageOutputs.map((item: GenerationOutput, key: number) => (
                                < div key={key} >
                                    <Image className={styles.center} src={item.mediaUrl} alt={item.mediaUrl} />
                                </div>
                            ))}
                        </Slider>
                    </>}
                </div>
                {imageOutputs.length > 0 && <>
                    <div className={styles.promptControls}>
                        <Button className={styles.nextBtn} onPress={handleClickNext} > <h5>Next</h5> </Button>
                    </div>
                </>}
            </section >
        </>
    )
}
