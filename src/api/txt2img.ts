'use server'

import { LivepeerAPI } from "./external/livepeer";
import { ModelsLabAPI } from "./external/modelslab";
import { GenerationOutput, Txt2imgInput } from "./types";

export async function txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_API === 'modelslab') {
        return await ModelsLabAPI.txt2img(params)
    }
    return await new LivepeerAPI().txt2img(params)
}
