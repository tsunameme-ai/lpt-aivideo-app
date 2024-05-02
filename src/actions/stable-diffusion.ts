'use server'

import { SDAPI, SDStaticAPI } from "@/libs/sd-api";
import { GenerationOutputItem, GenerationRequest, GenerationType, Img2vidInput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<Array<GenerationOutputItem>> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().txt2img()
    }
    return await new SDAPI().txt2img(params)
}

export async function img2vid(params: Img2vidInput): Promise<Array<GenerationOutputItem>> {
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
        if (data.action === 'img2vid') {
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
        outputs: data.outputs
    }
}


export async function fetchGenerationData(urlGid: string): Promise<GenerationRequest> {
    const gid = decodeURI(urlGid)
    console.log(gid)
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


export async function claim(userId: string, assetId: string, accessToken: string): Promise<{ success: boolean }> {
    console.log(accessToken)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/claim/${assetId}?asset=${userId}`, {
        headers: {
            Authorization: `Bear ${accessToken}`
        }
    })
    if (!res.ok) {
        throw new Error(`Error claim ${assetId} ${res.status}`)
    }
    return {
        success: res.status === 200
    }
}

export async function publish(userId: string, assetId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/publish/${assetId}?user=${userId}`)
    if (!res.ok) {
        throw new Error(`Error publish ${assetId} ${res.status}`)
    }
    return {
        success: res.status === 200
    }
}