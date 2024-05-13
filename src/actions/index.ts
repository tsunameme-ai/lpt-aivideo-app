'use server'

import { SDAPI, SDStaticAPI } from "@/libs/sd-api";
import { GenerationOutput, GenerationRequest, GenerationType, Img2vidInput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().txt2img()
    }
    return await new SDAPI().txt2img(params)
}

export async function img2vid(params: Img2vidInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().img2vid()
    }
    return await new SDAPI().img2vid(params)
}


const parseGenerationRequest = (data: any): GenerationRequest => {
    const parseResponse = (data: any): { type: GenerationType, input: Txt2imgInput | Img2vidInput } => {
        if (data.action === 'txt2img') {
            return {
                type: GenerationType.TXT2IMG,
                input: {
                    pPrompt: data.input.prompt,
                    nPrompt: data.input.negative_prompt,
                    modelId: data.input.model_id,
                    seed: data.input.seed,
                    guidanceScale: data.input.guidanceScale,
                    width: data.input.width,
                    height: data.input.height,
                    numOutput: data.input.numOutput
                } as Txt2imgInput
            }
        }
        if (['img2vid', 'img2vid-pending'].includes(data.action)) {
            return {
                type: GenerationType.IMG2VID,
                input: {
                    modelId: data.input.model_id,
                    imageUrl: data.input.image_url,
                    motionBucketId: data.input.motion_bucket_id,
                    noiseAugStrength: data.input.noise_aug_strength,
                    width: data.input.height,
                    height: data.input.height,
                    seed: data.input.seed
                } as Img2vidInput
            }
        }
        throw new Error('Unknown type')
    }
    const { type, input } = parseResponse(data)
    return {
        id: data.id,
        type: type,
        input: input,
        outputs: data.outputs.map((item: any, index: number) => {
            return {
                id: `${data.id}:${index}`,
                url: item.url,
                seed: item.seed,
                nsfw: item.nsfw || false,
                visibility: data.visibility,
                input: input
            }
        }),
        visibility: data.visibility
    }
}


export async function fetchGenerationData(urlGid: string): Promise<GenerationRequest> {
    const gid = decodeURI(urlGid)
    console.log(`fetchGenerationData ${gid}`)
    const segs = gid.split('%3A')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/generation/${segs[0]}`)
    if (!res.ok) {
        throw new Error(`Error fetch generatioan data ${res.status} ${gid}`)
    }
    const data = await res.json()
    return parseGenerationRequest(data)
}

export async function fetchGallery(limit: number, pageKey?: string): Promise<{ nextPage?: string, items: GenerationRequest[] }> {
    const pageQuery = pageKey ? `&page=${pageKey}` : ''
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/generations?limit=${limit}${pageQuery}`)
    if (!res.ok) {
        throw new Error(`Error fetch generation data ${res.status} ${pageKey}`)
    }
    const data = await res.json()
    return {
        nextPage: data['next-page'],
        items: data.items.map((item: any) => {
            return parseGenerationRequest(item)
        })
    }

}

export async function fetchAssetsByUser(userId: string, limit: number = 10, pageKey?: string): Promise<{ nextPage?: string, items: GenerationRequest[] }> {
    const pageQuery = pageKey ? `&page=${pageKey}` : ''
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/usergens/${userId}?limit=${limit}${pageQuery}`)
    if (!res.ok) {
        throw new Error(`Error fetch generation data ${res.status} ${pageKey}`)
    }
    const data = await res.json()
    return {
        nextPage: data['next-page'],
        items: data.items.map((item: any) => {
            return parseGenerationRequest(item)
        })
    }
}

export async function claim(userId: string, assetId: string, accessToken: string, salt: string): Promise<{ success: boolean }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/claim/${assetId.split(':')[0]}?user=${userId}&salt=${salt}`, {
        headers: {
            Authorization: `Bear ${accessToken}`
        }
    })
    if (!res.ok) {
        // console.log(res)
        return { success: false }
    }

    return {
        success: res.status === 200
    }
}

export async function togglePublish(userId: string, assetId: string, accessToken: string, publishOn: boolean): Promise<{ success: boolean, visibility?: string }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/publish/${assetId}?user=${userId}`, {
        method: publishOn ? 'GET' : 'DELETE',
        headers: {
            Authorization: `Bear ${accessToken}`
        }
    })
    const resultVisibility = publishOn ? 'community' : 'none'

    if (!res.ok) {
        const result = await res.json()
        console.log(res.status)
        console.log(result)
        return { success: false }
    }
    return {
        success: res.status === 200,
        visibility: resultVisibility
    }
}

export async function uploadImage(imgBase64Str: string): Promise<{ url: string }> {
    const postBody = {
        image: imgBase64Str
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/upload/image`, {
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify(postBody)
    })
    if (res.ok) {
        return await res.json()
    }
    console.log(`upload image failed ${res.status}`)
    throw new Error(`Failed to upload image.`)
}