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
    seed?: number
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
    { value: 'stable-diffu', label: 'Stable Diffusion 2.0' },
    { value: 'midjourney', label: 'MidJourney V4' },
]