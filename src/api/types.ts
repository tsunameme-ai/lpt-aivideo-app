export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidInput = {
    image: string
    nPrompt: string,
    seconds: number,
    motionButcketId: number,
    seed?: number
}
export type Txt2imgInput = {
    pPrompt: string,
    nPrompt: string,
    modelId: string,
    steps?: number,
    seed?: number,
    loraModel?: string
    loraStrength?: number
}
export type VideoGenerationOutput = {
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
]
export const Loras = [
    { value: 'hunter-x-hunter-lora-styl', label: 'Hunter X Hunter' },
    { value: 'sci-fi-environments', label: 'Sci-fi Environments' },
    { value: 'linkedin-diffusion', label: 'Linkedin Photoshoot' },
]