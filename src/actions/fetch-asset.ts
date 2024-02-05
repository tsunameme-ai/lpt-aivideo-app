'use server'

import { LivepeerAPI } from "@/libs/external/livepeer";
import { ModelsLabAPI } from "@/libs/external/modelslab";
import { GenerationOutput } from "@/libs/types";


export async function fetchAsset(vid: string): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab') {
        return await ModelsLabAPI.fetchAsset(vid)
    }
    return await new LivepeerAPI().fetchAsset(vid)
}
