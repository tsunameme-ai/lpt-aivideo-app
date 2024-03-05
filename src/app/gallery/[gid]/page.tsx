import { metadata } from '@/app/layout'
import { Metadata } from 'next'
import GalleryItemComponent from '@/components/gallery-item'
import { fetchGenerationData } from '@/actions/stable-diffusion'
import { GenerationType, Txt2imgInput } from '@/libs/types'

type Props = {
    params: { gid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    // parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const data = await fetchGenerationData(params.gid)
        if (data.type === GenerationType.TXT2IMG) {
            return {
                description: (data.input as Txt2imgInput).pPrompt,
                openGraph: {
                    images: (data.outputs || []).map(item => {
                        return item.url
                    }),
                },
            }
        }
        return {
            openGraph: {
                videos: (data.outputs || []).map(item => {
                    return item.url
                })
            },
        }
    }
    catch (e) {
        console.error(e)
    }
    return {}
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