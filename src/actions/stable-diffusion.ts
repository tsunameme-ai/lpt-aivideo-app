'use server'

import { SDAPI, SDStaticAPI } from "@/libs/sd-api";
import { GenerationOutput, Img2vidNativeInput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<Array<GenerationOutput>> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().txt2img()
    }
    return await new SDAPI().txt2img(params)
}

export async function img2vid(params: Img2vidNativeInput): Promise<Array<GenerationOutput>> {
    if (process.env.NEXT_PUBLIC_LIVEPEER === 'static') {
        return await new SDStaticAPI().img2vid()
    }
    return await new SDAPI().img2vid(params)
}