'use server'

import { SDAPI, SDStaticAPI } from "@/libs/sd-api";
import { GenerationOutputItem, GenerationRequest, GenerationType, Img2vidNativeInput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<Array<GenerationOutputItem>> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().txt2img()
    }
    return await new SDAPI().txt2img(params)
}

export async function img2vid(params: Img2vidNativeInput): Promise<Array<GenerationOutputItem>> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().img2vid()
    }
    return await new SDAPI().img2vid(params)
}

export async function fetchGenerationData(gid: string): Promise<GenerationRequest> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/generation/${gid}`)
    if (!res.ok) {
        throw new Error(`Unable to fetch generatioan data ${gid}`)
    }
    const data = await res.json()
    // console.log(data)
    const parseResponse = (data: any): { type: GenerationType, input: Txt2imgInput | Img2vidNativeInput } => {
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
                } as Img2vidNativeInput

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