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
export type VideoGenerationOutput = {
    id: string,
    status: string,
    mediaUrl: string,
    seed?: number
    width?: number,
    height?: number,
    eta?: number
}