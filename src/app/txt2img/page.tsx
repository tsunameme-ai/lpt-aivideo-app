'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Spacer } from '@nextui-org/react'
import { GenerationOutput, SDProvider } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import getSDProvider from '@/libs/sd-provider'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.css'
import GImage from '@/components/gimage'

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [sdProvider, setSdProvider] = useState<SDProvider>()
    const [imageOutput, setImageOutput] = useState<GenerationOutput>()
    useEffect(() => {
        const sdProvider = getSDProvider()
        setSdProvider(sdProvider)
    }, [])

    const onImageGenerated = (output: GenerationOutput) => {
        setImageOutput(output)
    }
    const handleClickNext = () => {
        const isAdvanced = searchParams.get('view') === 'advanced'
        router.push(`/img2vid/?imgurl=${imageOutput?.mediaUrl}${isAdvanced ? '&&view=advanced' : ''}`)
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
                        onImageGenerated={onImageGenerated}
                    />}
                    {imageOutput && <>
                        <Spacer y={4} />
                        <GImage src={imageOutput.mediaUrl} alt='preview' />
                        <Spacer y={4} />
                        <Button color="primary" onPress={handleClickNext}>Next</Button>
                    </>}
                </div>
            </section>
        </>
    )
}
