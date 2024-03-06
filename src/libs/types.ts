export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    seed?: number
}
export type Img2vidInput = {
    modelId: string,
    imageUrl?: string,
    motionBucketId: number,
    noiseAugStrength: number,
    width: number,
    height: number,
    seed?: number
    overlayBase64?: string
    imageId?: string
    overlayText?: string
    imageGenerationId?: string
}
export type Txt2imgInput = {
    pPrompt: string,
    nPrompt: string,
    modelId: string,
    seed?: number
    guidanceScale?: number
    width: number,
    height: number,
    numOutput: number
}
export type GenerationOutput = {
    id: string,
    outputs: Array<GenerationOutputItem>
}
export type GenerationOutputItem = {
    id: string,
    url: string,
    seed: number
}
export enum GenerationType {
    TXT2IMG = 'txt2img',
    IMG2VID = 'img2vid'
}
export type GenerationRequest = {
    id: string,
    type: GenerationType,
    input: Txt2imgInput | Img2vidInput
    outputs?: GenerationOutputItem[]
}
export type LocalImageData = {
    remoteURL: string,
    dataURL: string,
    width: number,
    height: number
    generationId: string
    overlayImageDataURL?: string
}

export type SDConfig = {
    models: Array<{ value: string, label: string, default?: boolean }>
    videoModels: Array<{ value: string, label: string, default?: boolean }>
}

export const DEFAULT_IMG_WIDTH = 1024
export const DEFAULT_IMG_HEIGHT = 1024
export const DEFAULT_VIDEO_WIDTH = 512
export const DEFAULT_VIDEO_HEIGHT = 512
export const DEFAULT_MOTION_BUCKET_ID = 50
export const DEFAULT_NOISE_AUG_STRENGTH = 0.05
export const DEFAULT_IMG_NUM_OUTPUT = 3
