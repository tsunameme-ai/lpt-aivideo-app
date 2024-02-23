export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidNativeInput = {
    imageUrl: string,
    motionButcketId: number,
    noiseAugStrength: number,
    width: number,
    height: number,
    overlayBase64?: string
}
export type Img2vidInput = {
    imageUrl?: string,
    motionButcketId: number,
    noiseAugStrength: number,
    width: number,
    height: number,
    seed?: number | string,
    imageFile?: File
}
export type Txt2imgInput = {
    pPrompt: string,
    nPrompt: string,
    modelId: string,
    seed?: string
    guidanceScale?: number
    width: number,
    height: number,
    numOutput: number,

    steps?: number
    scheduler?: string
}
export type GenerationOutput = {
    mediaUrl: string,
    seed?: number
}
export enum GenerationType {
    TXT2IMG = 'txt2img',
    IMG2VID = 'img2vid'
}
export type GenerationRequest = {
    id: string,
    type: GenerationType,
    input: Txt2imgInput | Img2vidNativeInput
    output?: GenerationOutput
}
export type LocalImageData = {
    remoteURL: string,
    dataURL: string,
    width: number,
    height: number
}

export type SDProvider = {
    models: Array<{ value: string, label: string, default?: boolean }>
    loras?: Array<{ value: string, label: string, baseModel?: string }>
    schedulers?: Array<{ value: string, label: string, default?: boolean }>
}