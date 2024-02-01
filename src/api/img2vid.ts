'use server'

import { LivepeerAPI } from "./external/livepeer";
import { ModelsLabAPI } from "./external/modelslab";
import { GenerationOutput, Img2vidInput } from "./types";

const fetchImageAsFile = async (url: string): Promise<File> => {
    const response = await fetch(url)
    if (response.status !== 200) {
    }
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

    //Download image
    const imgFile = await fetchImageAsFile(params.imageUrl!)
    params.imageFile = imgFile


    if (process.env.NEXT_PUBLIC_API === 'modelslab') {
        return await ModelsLabAPI.img2vid(params)

    }
    return await new LivepeerAPI().img2vid(params)
}
