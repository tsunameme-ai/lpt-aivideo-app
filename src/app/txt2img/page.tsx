'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spacer } from '@nextui-org/react'
import { GenerationOutput, SDProvider } from '@/libs/types'
import Txt2ImgComponent from '@/components/txt2img'
import getSDProvider from '@/libs/sd-provider'
import { useEffect, useState } from 'react'
import styles from '../../styles/home.module.css'

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [sdProvider, setSdProvider] = useState<SDProvider>()
    useEffect(() => {
        const sdProvider = getSDProvider(process.env.NEXT_PUBLIC_SD_PROVIDER)
        setSdProvider(sdProvider)
    }, [])

    const onGenerationRequested = (output: GenerationOutput) => {
        const isAdvanced = searchParams.get('view') === 'advanced'
        if (process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab') {
            router.push(`/image/${output?.id}${isAdvanced ? '?view=advanced' : ''}`)
        }
        else {
            router.push(`/image/${output?.id}?${isAdvanced ? 'view=advanced&' : ''}media=${output?.mediaUrl}`)
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
                        onGenerationRequested={onGenerationRequested}
                    />}
                </div>
            </section>
        </>
    )
}
