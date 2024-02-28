export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidNativeInput = {
    modelId: string,
    imageUrl?: string,
    motionBucketId: number,
    noiseAugStrength: number,
    width: number,
    height: number,
    seed?: number
    overlayBase64?: string
}
export type Img2vidInput = {
    imageUrl?: string,
    motionBucketId: number,
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
    seed?: number
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
    overlayImageDataURL?: string
}

export type SDConfig = {
    models: Array<{ value: string, label: string, default?: boolean }>
    videoModels: Array<{ value: string, label: string, default?: boolean }>
    loras?: Array<{ value: string, label: string, baseModel?: string }>
    schedulers?: Array<{ value: string, label: string, default?: boolean }>
}

export const DEFAULT_IMG_WIDTH = 1024
export const DEFAULT_IMG_HEIGHT = 1024
export const DEFAULT_VIDEO_WIDTH = 512
export const DEFAULT_VIDEO_HEIGHT = 512
export const DEFAULT_MOTION_BUCKET_ID = 50
export const DEFAULT_NOISE_AUG_STRENGTH = 0.05
export const DEFAULT_IMG_NUM_OUTPUT = 3
