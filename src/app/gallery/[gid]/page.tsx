import { Metadata } from 'next'
import GalleryItemComponent from '@/components/gallery-item'
import { fetchGenerationData } from '@/actions/stable-diffusion'
import { GenerationType, Img2vidInput, Txt2imgInput } from '@/libs/types'


type Props = {
    params: { gid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    try {
        //fields ref https://stackoverflow.com/questions/76265976/next-js-dynamic-metadata
        const data = await fetchGenerationData(params.gid)
        if (data.type === GenerationType.TXT2IMG) {
            return {
                title: 'Tsunameme',
                description: 'We bring revolutions to meme',
                openGraph: {
                    images: (data.outputs || []).map(item => {
                        return item.url
                    }),
                    type: 'website',
                    description: (data.input as Txt2imgInput).pPrompt,
                },
            }
        }

        return {
            title: 'Tsunameme',
            description: 'We bring revolutions to meme',
            openGraph: {
                videos: (data.outputs || []).map(item => {
                    return item.url
                }),
                images: (data.input as Img2vidInput).imageUrl,
                type: 'website',
                description: (data.input as Img2vidInput).overlayText,
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
            <GalleryItemComponent generationId={params.gid} />
        </>
    )
}