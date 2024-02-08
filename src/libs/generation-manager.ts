import { GenerationRequest, GenerationType, Img2vidInput, Txt2imgInput } from "./types"
import { Utils } from "./utils"

export class GenerationManager {
    private static instance: GenerationManager
    private generations: Map<string, GenerationRequest> = new Map()
    public static getInstance() {
        if (!GenerationManager.instance) {
            GenerationManager.instance = new GenerationManager()
        }
        return GenerationManager.instance
    }


    public addGenerationRequest(type: GenerationType, input: Txt2imgInput | Img2vidInput) {

        const id = new Date().getTime().toString()
        this.generations.set(id, {
            id: id,
            type: type,
            input: input
        })
        return this.generations.get(id)
    }

    public async fetchPendingRequests(): Promise<Map<string, GenerationRequest>> {
        await Utils.delay(500)
        return this.generations
    }
}