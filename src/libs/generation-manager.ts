import { GenerationRequest, GenerationType, Img2vidInput, Txt2imgInput } from "./types"
import { Utils } from "./utils"
import ShortUniqueId from 'short-unique-id'

export class GenerationManager {
    private static instance: GenerationManager
    private generations: Map<string, GenerationRequest> = new Map()
    public static getInstance() {
        if (!GenerationManager.instance) {
            GenerationManager.instance = new GenerationManager()
        }
        return GenerationManager.instance
    }


    public async addGenerationRequest(type: GenerationType, input: Txt2imgInput | Img2vidInput) {
        await Utils.delay(200)
        const id = new ShortUniqueId({ length: 6 }).rnd()
        this.generations.set(id, {
            id: id,
            type: type,
            input: input
        })
        return this.generations.get(id)
    }

    public async removeGenerationRequest(id: string) {
        await Utils.delay(200)
        this.generations.delete(id)
    }

    public async fetchPendingRequests(): Promise<Map<string, GenerationRequest>> {
        await Utils.delay(200)
        return this.generations
    }
}