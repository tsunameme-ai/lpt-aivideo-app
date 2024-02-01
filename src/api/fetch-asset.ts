'use server'

import { LivepeerAPI } from "./external/livepeer";
import { ModelsLabAPI } from "./external/modelslab";
import { GenerationOutput } from "./types";


export async function fetchAsset(vid: string): Promise<GenerationOutput> {
    if (process.env.NEXT_PUBLIC_API === 'modelslab') {
        return await ModelsLabAPI.fetchAsset(vid)
    }
    return await new LivepeerAPI().fetchAsset(vid)
}
