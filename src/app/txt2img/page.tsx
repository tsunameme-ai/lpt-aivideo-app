'use client'
import { useRouter } from 'next/navigation'
import { Spacer } from '@nextui-org/react'
import { GenerationOutputItem } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import { useState } from 'react'
import React from 'react'
import { useGenerationContext } from '@/context/generation-context'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '@/styles/home.module.css'
import { appFont } from '../fonts'
import { PrimaryButton } from '@/components/buttons'
import Carousel from './carousel'


export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [imageOutputs, setImageOutputs] = useState<Array<GenerationOutputItem>>(gContext.t2iOutputs)
    const [selectedOutputIndex, setSelectedOutputIndex] = useState<number>(gContext.t2iOutputSelectedIndex)

    const onImagesGenerated = (outputs: Array<GenerationOutputItem>, resetSelectedIndex: number) => {
        setImageOutputs(outputs)
        setSelectedOutputIndex(resetSelectedIndex)
    }

    const handleClickNext = () => {
        gContext.setT2iOutputSelectedIndex(selectedOutputIndex)
        router.push('/caption')
    }

    return (
        <>
            <section className={`${styles.main} ${appFont.className}`}>
                {gContext.isReady && <div className={styles.centerSection}>
                    <div className='font-medium'>Step 1 of 3: Write the prompt</div>
                    <Spacer y={2} />
                    {imageOutputs.length > 0 && <Carousel imageOutputs={imageOutputs} selectedOutputIndex={selectedOutputIndex} onImageOutputSelected={setSelectedOutputIndex} />}
                    <Txt2ImgComponent
                        isAdvancedView={gContext.isAdvancedView}
                        onImagesGenerated={onImagesGenerated} />
                    <Spacer y={4} />
                    {imageOutputs.length > 0 &&
                        <>
                            <PrimaryButton onPress={handleClickNext}>Next</PrimaryButton>
                            <Spacer y={4} />
                        </>}
                </div>}
            </section>
        </>
    )
}