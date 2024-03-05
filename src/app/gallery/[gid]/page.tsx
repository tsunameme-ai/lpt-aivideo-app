import { metadata } from '@/app/layout'
import { Metadata } from 'next'
import GalleryItemComponent from '@/components/gallery-item'
import { fetchGenerationData } from '@/actions/stable-diffusion'

type Props = {
    params: { gid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    // parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await fetchGenerationData(params.gid)

    return {
        description: (data.input as any).prompt || 'prompt',
        openGraph: {
            images: data.outputs.map(item => {
                return item.url
            })
        },
    }
}

export default function Page({ params }: { params: { gid: string } }) {
    return (
        <>
            <div>{`prompt: ${metadata.description}`}</div>
            <div>{`Asset ${params.gid}`}</div>
            <div>Under construction</div>
            <GalleryItemComponent generationId={params.gid} />
        </>
    )
}