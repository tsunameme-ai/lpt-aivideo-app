'use client'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Divider, Spacer } from '@nextui-org/react'
import { GenerationOutput } from '@/api/types'
import Txt2ImgComponent from '@/components/txt2img'

export default function Page() {
    const router = useRouter()
    const onGenerationRequested = (output: GenerationOutput) => {
        if (process.env.NEXT_PUBLIC_API === 'modelslab') {
            router.push(`/image/${output?.id}`)
        }
        else {
            router.push(`/image/${output?.id}?media=${output?.mediaUrl}`)
        }
    }
    return (
        <>
            <section>
                <Card>
                    <CardHeader>
                        <h1>Text to Image</h1>
                        <Spacer y={4} />
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Txt2ImgComponent
                            onGenerationRequested={onGenerationRequested}
                        />
                    </CardBody>
                </Card>
            </section>
        </>
    )
}
