'use server'

import { LivepeerAPI } from "../libs/external/livepeer";
import { ModelsLabAPI } from "../libs/external/modelslab";
import { GenerationOutput, Txt2imgInput } from "../libs/types";

export async function txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab') {
        return await ModelsLabAPI.txt2img(params)
    }
    return await new LivepeerAPI().txt2img(params)
}
