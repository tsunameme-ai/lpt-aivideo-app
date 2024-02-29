import { GenerationResponse } from '@/libs/types'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { gid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    // parent: ResolvingMetadata
): Promise<Metadata> {

    // fetch data
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/generation/${params.gid}`)
    const data = await res.json() as GenerationResponse




    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    return {
        description: data.input.pPrompt || 'prompt',


        openGraph: {
            images: [data.outputs[0].url]
            // images: ['/some-specific-page-image.jpg', ...previousImages],
        },
    }
}

export default function Page({ params }: { params: { gid: string, asset: string } }) {
    console.log(`Asset view $`)

    return (
        <>
            <small>{`Asset ${params.asset} ${params.gid}`}</small>
            <small>Under construction</small>
        </>
    )
}