'use server'

import { LivepeerAPI } from "@/libs/external/livepeer";
import { GenerationOutput } from "@/libs/types";


export async function fetchAsset(vid: string): Promise<GenerationOutput> {
    return await new LivepeerAPI().fetchAsset(vid)
}
