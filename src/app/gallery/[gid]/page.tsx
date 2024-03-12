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
        console.log(data)
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
            title: 'Groove',
            description: 'An AI powered meme generation tool',

            openGraph: {
                videos: (data.outputs || []).map(item => {
                    return item.url
                }),
                images: (data.input as Img2vidInput).imageUrl
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