'use server'

import { LivepeerAPI } from "@/libs/external/livepeer";
import { GenerationOutput, Txt2imgInput } from "@/libs/types";

export async function txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
    return await new LivepeerAPI().txt2img(params)
}
