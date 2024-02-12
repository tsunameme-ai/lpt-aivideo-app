'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Radio, RadioGroup, Spacer } from '@nextui-org/react'
import { GenerationOutput, SDProvider } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import getSDProvider from '@/libs/sd-provider'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.css'
import GImage from '@/components/gimage'
import React from 'react'

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [sdProvider, setSdProvider] = useState<SDProvider>()
    const [imageOutputs, setImageOutputs] = useState<Array<GenerationOutput>>()
    const [imageURL, setImageURL] = useState<string>()
    useEffect(() => {
        const sdProvider = getSDProvider()
        setSdProvider(sdProvider)
    }, [])

    const onImagesGenerated = (outputs: Array<GenerationOutput>) => {
        setImageOutputs(outputs)
    }
    const onImageOutputSelected = (value: string) => {
        setImageURL(value)
    }

    const handleClickNext = () => {
        const imgurl = imageURL || imageOutputs?.[0].mediaUrl
        if (imgurl) {
            const isAdvanced = searchParams.get('view') === 'advanced'
            router.push(`/add-text/?imgurl=${imgurl}${isAdvanced ? '&view=advanced' : ''}`)
        }
    }
    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>

                    <h3>Step 1: Describe the cover of your ecard</h3>
                    <Spacer y={4} />
                    {sdProvider && <Txt2ImgComponent
                        sdProvider={sdProvider}
                        isAdvancedView={searchParams.get('view') === 'advanced'}
                        onImagesGenerated={onImagesGenerated}
                    />}
                    {imageOutputs && <>
                        <Spacer y={4} />
                        <RadioGroup
                            label="Select an image"
                            color="secondary"
                            defaultValue={imageOutputs[0].mediaUrl}
                            onValueChange={onImageOutputSelected}
                        >
                            {imageOutputs.map((item) => (
                                <Radio key={item.mediaUrl} value={item.mediaUrl}><GImage src={item.mediaUrl} alt={item.mediaUrl} /> </Radio>
                            ))}
                        </RadioGroup>
                        <Spacer y={4} />
                        <Button color='primary' onPress={handleClickNext}>Next</Button>
                    </>}
                </div>
            </section>
        </>
    )
}
