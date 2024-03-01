import { metadata } from '@/app/layout'
import { GenerationResponse } from '@/libs/types'
// import { Metadata, ResolvingMetadata } from 'next'
import { Metadata } from 'next'

type Props = {
    params: { gid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

const fetchGenerationData = async (gid: string): Promise<GenerationResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/generation/${gid}`)
    return await res.json() as GenerationResponse
}

export async function generateMetadata(
    { params }: Props,
    // parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await fetchGenerationData(params.gid)
    console.log(JSON.stringify(data))

    return {
        description: (data.input as any).prompt || 'prompt',

        openGraph: {
            images: [data.outputs[0].url]
        },
    }
}

export default function Page({ params }: { params: { gid: string } }) {
    const imgs = metadata.openGraph?.images
    console.log('??? imgs')
    console.log(imgs)
    return (
        <>
            <div>{`prompt: ${metadata.description}`}</div>
            <div>{`Asset ${params.gid}`}</div>
            <div>Under construction</div>
            {imgs && Array.isArray(imgs) && imgs.length > 0 && <>
                {imgs.map((item) => (
                    // <Image src={item} />
                    <img src={item as string} alt={item as string} />
                ))}
            </>}
        </>
    )
}