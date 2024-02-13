'use client'
import { useRouter } from 'next/navigation'
import { Button, Radio, RadioGroup, Spacer } from '@nextui-org/react'
import { GenerationOutput, SDProvider } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import getSDProvider from '@/libs/sd-provider'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.css'
import GImage from '@/components/gimage'
import React from 'react'
import { useGenerationContext } from '@/context/generation-context'
import AdvancedIndicator from '@/components/advanced-indicator'

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const [sdProvider, setSdProvider] = useState<SDProvider>()
    const [imageOutputs, setImageOutputs] = useState<Array<GenerationOutput>>(gContext.t2iOutputs)
    const [selectedOutputIndex, setSeelectedOutputIndex] = useState<number>(gContext.t2iOutputSelectedIndex)
    useEffect(() => {
        const sdProvider = getSDProvider()
        setSdProvider(sdProvider)
    }, [])

    const onImagesGenerated = (outputs: Array<GenerationOutput>) => {
        setImageOutputs(outputs)
    }
    const onImageOutputSelected = (value: string) => {
        const num = parseInt(value)
        setSeelectedOutputIndex(num)
    }

    const handleClickNext = () => {
        gContext.setT2iOutputSelectedIndex(selectedOutputIndex)
        router.push('/add-text')
    }
    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div>Step 1: Write prompt </div>
                    <AdvancedIndicator />
                    <Spacer y={2} />
                    {sdProvider && <Txt2ImgComponent
                        sdProvider={sdProvider}
                        isAdvancedView={gContext.isAdvancedView}
                        onImagesGenerated={onImagesGenerated}
                    />}

                    {imageOutputs.length > 0 && <>
                        <Spacer y={4} />
                        <RadioGroup
                            label="Select an image"
                            color="secondary"
                            defaultValue={selectedOutputIndex.toString()}
                            onValueChange={onImageOutputSelected}
                        >
                            {imageOutputs.map((item: GenerationOutput, index: number) => (
                                <Radio key={`output${index.toString()}`} value={index.toString()}><GImage src={item.mediaUrl} alt={item.mediaUrl} /> </Radio>
                            ))}
                        </RadioGroup>
                        <Spacer y={4} />
                        <Button className="w-full" color="primary" onPress={handleClickNext}>Next step</Button>
                    </>}
                </div>
            </section>
        </>
    )
}
