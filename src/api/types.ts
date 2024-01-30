export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidInput = {
    imageUrl?: string,
    nPrompt?: string,
    seconds?: number,
    motionButcketId: number,
    seed?: number,
    imageFile?: File
}
export type Txt2imgInput = {
    pPrompt: string,
    nPrompt: string,
    modelId: string,
    steps?: number,
    seed?: string,
    loraModel?: string
    loraStrength?: number
    guidanceScale?: number
}
export type GenerationOutput = {
    id: string,
    status: string,
    mediaUrl: string,
    seed?: number
    width?: number,
    height?: number,
    eta?: number
}

export const SDModels = [
    { value: 'sd-1.5', label: 'Stable Diffusion v1.5' },
    { value: 'sdxl', label: 'SDXL 1.0' },
    { value: 'midjourney', label: 'MidJourney V4' },
    { value: 'anything-v45', label: 'Anything V4.5' },
]
export const Loras = [
    { value: 'hunter-x-hunter-lora-styl', label: 'Hunter X Hunter' },//https://modelslab.com/models/hunter-x-hunter-lora-styl
    { value: 'sci-fi-environments', label: 'Sci-fi Environments' },//https://modelslab.com/models/sci-fi-environments
    { value: 'creature-vase-v10', label: 'Creature Vase v1.0' }, //https://modelslab.com/models/creature-vase-v10
]