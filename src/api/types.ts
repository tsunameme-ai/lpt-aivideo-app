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
    seed?: string
    scheduler?: string
    loraModel?: string
    loraStrength?: number
    guidanceScale?: number
    clipSkip?: number
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
    { value: 'anything-v45-pruned-merge', label: 'Anything-v4.5-pruned-mergedVae' },
]
export const Loras = [
    { value: 'hunter-x-hunter-lora-styl', label: 'Hunter X Hunter' },//https://modelslab.com/models/hunter-x-hunter-lora-styl
    { value: 'superhero-comic', label: 'superhero-comic', baseModel: 'sd-1.5' }, //https://modelslab.com/models/superhero-comic https://civitai.com/models/189634/superheroamerican-comic
    { value: 'creature-vase-v10', label: 'Creature Vase v1.0' }, //https://modelslab.com/models/creature-vase-v10
]
// https://blog.segmind.com/what-are-schedulers-in-stable-diffusion/
// https://huggingface.co/docs/diffusers/using-diffusers/schedulers
export const Schedulers = [
    { value: 'DDPMScheduler', label: 'DDPM' },
    { value: 'DDIMScheduler', label: 'DDIM' },
    { value: 'PNDMScheduler', label: 'PNDM' },
    { value: 'LMSDiscreteScheduler', label: 'LMS' },
    { value: 'EulerDiscreteScheduler', label: 'Euler' },
    { value: 'EulerAncestralDiscreteScheduler', label: 'Euler a' },
    { value: 'DPMSolverMultistepScheduler', label: 'DPM++ 2M' },
    { value: 'HeunDiscreteScheduler', label: 'Heun' },
    { value: 'KDPM2DiscreteScheduler', label: 'DPM2' },
    { value: 'DPMSolverSinglestepScheduler', label: 'DPM++ SDE' },
    { value: 'KDPM2AncestralDiscreteScheduler', label: 'DPM2 a' },
    { value: 'UniPCMultistepScheduler', label: 'UniPCMultistep' },
    { value: 'DDIMInverseScheduler', label: 'DDIMInverse' },
    { value: 'DEISMultistepScheduler', label: 'DEISMultistep' },
    { value: 'IPNDMScheduler', label: 'IPNDM' },
    { value: 'KarrasVeScheduler', label: 'KarrasVe' },
    { value: 'ScoreSdeVeScheduler', label: 'ScoreSdeVe' },
    { value: 'LCMScheduler', label: 'LCM' }
]