export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidInput = {
    imageUrl?: string,
    seconds?: number,
    motionButcketId: number,
    noiseAugStrength: number,
    seed?: number | string,
    imageFile?: File
}
export type Txt2imgInput = {
    pPrompt: string,
    nPrompt: string,
    modelId: string,
    steps?: number,
    seed?: string
    scheduler?: string
    loraModel?: string
    loraStrength?: number
    guidanceScale?: number
    clipSkip?: number
    width: number,
    height: number
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
export type SDProvider = {
    models: Array<{ value: string, label: string, default?: boolean }>
    loras?: Array<{ value: string, label: string, baseModel?: string }>
    schedulers?: Array<{ value: string, label: string, default?: boolean }>
}