export type Txt2vidInput = {
    pPrompt: string,
    nPrompt: string,
    seconds: number,
    scheduler: Txt2VidSchedulers,
}
export enum Txt2VidSchedulers {
    DDPMScheduler = 'DDPMScheduler',
    DDIMScheduler = 'DDIMScheduler',
    PNDMScheduler = 'PNDMScheduler',
    LMSDiscreteScheduler = 'LMSDiscreteScheduler',
    EulerDiscreteScheduler = 'EulerDiscreteScheduler',
    EulerAncestralDiscreteScheduler = 'EulerAncestralDiscreteScheduler',
    DPMSolverMultistepScheduler = 'DPMSolverMultistepScheduler',
    HeunDiscreteScheduler = 'HeunDiscreteScheduler',
    KDPM2DiscreteScheduler = 'KDPM2DiscreteScheduler',
    DPMSolverSinglestepScheduler = 'DPMSolverSinglestepScheduler',
    KDPM2AncestralDiscreteScheduler = 'KDPM2AncestralDiscreteScheduler',
    UniPCMultistepScheduler = 'UniPCMultistepScheduler',
    DDIMInverseScheduler = 'DDIMInverseScheduler',
    DEISMultistepScheduler = 'DEISMultistepScheduler',
    IPNDMScheduler = 'IPNDMScheduler',
    KarrasVeScheduler = 'KarrasVeScheduler',
    ScoreSdeVeScheduler = 'ScoreSdeVeScheduler',
    LCMScheduler = 'LCMScheduler'
}
export type Txt2vidOutput = {
    id: string,
    status: string,
    mediaUrl: string,
    width?: number,
    height?: number,
    eta?: number
}