'use server'

import { LivepeerAPI } from "@/libs/external/livepeer";
import { LivepeerStaticAPI } from "@/libs/external/livepeer-static";
import { GenerationOutput, Img2vidInput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_LIVEPEER_STATIC) {
        return await new LivepeerStaticAPI().txt2img()
    }
    return await new LivepeerAPI().txt2img(params)
}


const fetchImageAsFile = async (url: string): Promise<File> => {
    const response = await fetch(url, { cache: 'no-cache' })
    if (response.ok) {
        const blob = await response.blob()
        const file = new File([blob], 'image.png', { type: 'image/png' })
        return file
    }
    console.log(`--fetchImageAsFile response ${url} -- `)
    console.log(response)
    throw new Error(`Fetch image failed ${response.status}`)
}
export async function img2vid(params: Img2vidInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_LIVEPEER_STATIC) {
        return await new LivepeerStaticAPI().img2vid()
    }
    //Download image
    const imgFile = await fetchImageAsFile(params.imageUrl!)
    params.imageFile = imgFile
    return await new LivepeerAPI().img2vid(params)
}