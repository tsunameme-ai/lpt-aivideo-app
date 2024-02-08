import { GenerationRequest, GenerationType, Img2vidInput, Txt2imgInput } from "./types"

export class GenerationManager {
    private static instance: GenerationManager
    public static getInstance() {
        if (!GenerationManager.instance) {
            GenerationManager.instance = new GenerationManager()
        }
        return GenerationManager.instance
    }
    public generations: Map<string, GenerationRequest> = new Map()

    public addGenerationRequest(type: GenerationType, input: Txt2imgInput | Img2vidInput) {

        const id = new Date().getTime().toString()
        this.generations.set(id, {
            id: id,
            type: type,
            input: input
        })
        return this.generations.get(id)
    }
}